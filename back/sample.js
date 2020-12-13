const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');

const { OrangeData, Order } = require('node-orangedata');
const { OrangeDataError } = require('node-orangedata/lib/errors');

const cert = fs.readFileSync('./keys/client.crt');
const key = fs.readFileSync('./keys/client.key');
const passphrase = '1234';
const ca = fs.readFileSync('./keys/cacert.pem');
const privateKey = fs.readFileSync('./keys/private_key.pem');

const apiUrlTest = 'https://apip.orangedata.ru:2443/api/v2';
//const apiUrlProd = 'https://api.orangedata.ru:12003/api/v2';

const apiUrl = apiUrlTest;

const agent = new OrangeData({ apiUrl, cert, key, passphrase, ca, privateKey });

// 5902059146
// 7725713770
const order = new Order({
    id: crypto.randomBytes(18).toString('hex'),
    inn: '5902059146',
    key: '5902059146',
    group: 'Main',
    type: 1, // Приход
    customerContact: '+79991234567',
    customer: 'покупатель',
    customerINN: '5902059146',
    taxationSystem: 1, // Общая
});
order
    .addPosition({
        text: 'Тестовый товар',
        quantity: 5,
        price: 10,
        tax: 1,
        paymentMethodType: 1,
        paymentSubjectType: 1,
        nomenclatureCode: 'igQVAAADMTIzNDU2Nzg5MDEyMwAAAQ==',
        supplierINN: '3123011520',
        supplierInfo: { phoneNumbers: ['+79998887766'], name: 'Наименование поставщика' },
    })
    .addPayment({ type: 1, amount: 10 })
    .addPayment({ type: 2, amount: 40 })
    .addAgent({
        agentType: 127,
        paymentTransferOperatorPhoneNumbers: ['+79998887766'],
        paymentAgentOperation: 'Операция агента',
        paymentAgentPhoneNumbers: ['+79998887766'],
        paymentOperatorPhoneNumbers: ['+79998887766'],
        paymentOperatorName: 'Наименование оператора перевода',
        paymentOperatorAddress: 'Адрес оператора перевода',
        paymentOperatorINN: '3123011520',
        supplierPhoneNumbers: ['+79998887766'],
    })
    .addUserAttribute({
        name: 'citation',
        value: 'В здоровом теле здоровый дух, этот лозунг еще не потух!',
    });
// help function to check order's status
async function checkOrder({ inn, id }) {
    console.log('Получение статуса чека...');
    const status = await agent.getOrderStatus(inn, id);
    if (status) {
        console.log('Чек успешно пробит онлайн-кассой');
        return status;
    }
    console.log('Чек создан и добавлен в очередь на обработку, но еще не обработан');
    console.log('Следующая проверка статуса через 5 секунд');
    return new Promise((resolve, reject) => {
        setTimeout(() => checkOrder(order).then(resolve, reject), 5 * 1000);
    });
}
// main example function with sending order and checking it's status
async function tryOrange() {
    console.log('Отправка чека онлайн-кассе...');
    try {
        await agent.sendOrder(order);
        console.log('Чек успешно отправлен! Получение статуса чека...');
        const status = await checkOrder(order);
        if (status) {
            console.log(util.inspect(status, { colors: true, depth: null }));
        } else {
            console.log('Чек еще не обработан :(');
        }
    } catch (error) {
        if (error instanceof OrangeDataError) {
            console.log('При обработке возникла ошибка OrangeData, она содержит дополнительные сведения:');
            console.log(util.inspect(error, { colors: true, depth: null }));
            return;
        }
        console.log('Стандартная ошибка node.js возникла при обработке запроса:');
        console.log(util.inspect(error, { colors: true, depth: null }));
    }
}
// start example
tryOrange();
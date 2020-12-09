const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');

var express = require('express')
var app = express()
app.use(express.json())

const { OrangeData, Order } = require('node-orangedata');
const { OrangeDataError } = require('node-orangedata/lib/errors');
// const Order = require('node-orangedata/lib/Order');

const cert = fs.readFileSync('./keys/client.crt');
const key = fs.readFileSync('./keys/client.key');
const passphrase = '1234';
const ca = fs.readFileSync('./keys/cacert.pem');
const privateKey = fs.readFileSync('./keys/private_key.pem');
const apiUrl = 'https://apip.orangedata.ru:2443/api/v2';

const agent = new OrangeData({ apiUrl, cert, key, passphrase, ca, privateKey });

app.post('/sendOrder', async function (req, res) {
    console.log('Отправка чека онлайн-кассе...');
    try {
        const requestOrder = req.body;
        const order = new Order(requestOrder);
        await requestOrder.positions.forEach((e) => order.addPosition(e));
        await requestOrder.payments.forEach((e) => order.addPayment(e));
        await agent.sendOrder(order);
        console.log('Чек успешно отправлен! Получение статуса чека...');
        res.sendStatus(200);
    } catch (error) {
        if (error instanceof OrangeDataError) {
            console.log('При обработке возникла ошибка OrangeData, она содержит дополнительные сведения:');
            console.log(util.inspect(error, { colors: true, depth: null }));
            res.status(400).send('OrangeDataError');
            return;
        }
        console.log('Стандартная ошибка node.js возникла при обработке запроса:');
        console.log(util.inspect(error, { colors: true, depth: null }));
        res.status(400).send(`NodeJsError,${error}`);
    }
})

app.get('/checkOrder', async function (req, res) {
    console.log('Проверка чека в онлайн-кассе...');
    try {
        const status = await agent.getOrderStatus(req.body.inn, req.body.id);
        if (status) {
            console.log(util.inspect(status, { colors: true, depth: null }));
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    } catch (error) {
        if (error instanceof OrangeDataError) {
            console.log('При обработке возникла ошибка OrangeData, она содержит дополнительные сведения:');
            console.log(util.inspect(error, { colors: true, depth: null }));
            res.status(400).send('OrangeDataError');
            return;
        }
        console.log('Стандартная ошибка node.js возникла при обработке запроса:');
        console.log(util.inspect(error, { colors: true, depth: null }));
        res.status(400).send(`NodeJsError,${error}`);
    }
})

app.post('/test', async function (req, res) {
    res.sendStatus(200);
})

app.listen(3000);
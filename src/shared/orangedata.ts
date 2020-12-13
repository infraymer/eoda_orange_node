import { OrangeData } from 'node-orangedata'
import { join } from 'path'
import { readFileSync } from 'fs'

const keyFromPath = (key: string) => readFileSync(join(__dirname, `keys/${key}`))

export const prodAgent = new OrangeData({
  apiUrl: 'https://api.orangedata.ru:12003/api/v2',
  cert: keyFromPath('prod/client.crt'),
  key: keyFromPath('prod/client.key'),
  ca: keyFromPath('prod/cacert.pem'),
  privateKey: keyFromPath('prod/private_key.pem'),
  passphrase: '1234'
})

export const testAgent = new OrangeData({
  apiUrl: 'https://apip.orangedata.ru:2443/api/v2',
  cert: keyFromPath('test/client.crt'),
  key: keyFromPath('test/client.key'),
  ca: keyFromPath('test/cacert.pem'),
  privateKey: keyFromPath('test/private_key.pem'),
  passphrase: '1234'
})

import express from 'express'
import { Router, json } from 'express'

import checkOrder from './routes/checkOrder'
import sendOrder from './routes/sendOrder'

const app = express()
const router = Router()

router.get('/checkOrder', checkOrder)
router.post('/sendOrder', sendOrder)

app.use(json())
app.use(router)

app.listen(process.env.PORT || 3000)

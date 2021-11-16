import { NextFunction, Request, Response } from 'express'
import { Order, OrderConfig, ServerErrorResponse } from 'node-orangedata'
import { asyncWrapper } from '../shared/helper'
import { prodAgent, testAgent } from '../shared/orangedata'

export default asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const agent = req.query.isTest ? testAgent : prodAgent

  const requestOrder = req.body as OrderConfig

  console.log('===============REQUEST===============')
  console.log('Body', requestOrder)

  const orderConfig = { ...requestOrder }
  delete orderConfig.positions
  delete orderConfig.payments

  console.log('OrderConfig', orderConfig)

  const order = new Order(orderConfig)

  console.log('Order', order)

  if (requestOrder.positions)
    for (const position of requestOrder.positions) {
      await order.addPosition(position)
    }

  if (requestOrder.payments)
    for (const payment of requestOrder.payments) {
      await order.addPayment(payment)
    }

  if (requestOrder.agent) order.addAgent(requestOrder.agent)

  if (requestOrder.userAttribute) order.addUserAttribute(requestOrder.userAttribute)

  try {
    await agent.sendOrder(order)
    console.log('===============RESPONSE===============')
    console.log('Запрос выполнен успешно!')
  } catch (e) {
    console.log('===============RESPONSE===============')
    console.log(e)
    console.log(JSON.stringify(e as ServerErrorResponse))
    res.status(400).send(e as ServerErrorResponse)
    return
  }

  res.send()
})

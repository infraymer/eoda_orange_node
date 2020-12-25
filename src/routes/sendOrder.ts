import { asyncWrapper } from '../shared/helper'
import { Request, Response, NextFunction } from 'express'
import { testAgent, prodAgent } from '../shared/orangedata'
import { Order, OrderConfig } from 'node-orangedata'

export default asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const agent = req.query.isTest ? testAgent : prodAgent

  const requestOrder = req.body as OrderConfig

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

  if (requestOrder.agent)
    order.addAgent(requestOrder.agent)

  if (requestOrder.userAttribute)
    order.addUserAttribute(requestOrder.userAttribute)

  await agent.sendOrder(order)

  res.send({ success: true })
})

import { asyncWrapper } from '../shared/helper'
import { Request, Response, NextFunction } from 'express'
import { testAgent, prodAgent } from '../shared/orangedata'
import { Order, OrderConfig } from 'node-orangedata'

export default asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const agent = req.query.isTest ? testAgent : prodAgent

  const requestOrder = req.body as OrderConfig
  const order = new Order(requestOrder)

  for (const position of requestOrder.positions) {
    await order.addPosition(position)
  }

  for (const payment of requestOrder.payments) {
    await order.addPayment(payment)
  }

  await agent.sendOrder(order)

  res.send({ success: true })
})

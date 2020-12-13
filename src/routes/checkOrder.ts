import { asyncWrapper } from '../shared/helper'
import { Request, Response, NextFunction } from 'express'
import { testAgent, prodAgent } from '../shared/orangedata'

export default asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const agent = req.query.isTest ? testAgent : prodAgent
  const status = await agent.getOrderStatus(req.body.inn, req.body.id)
  res.send({ success: !!status })
})

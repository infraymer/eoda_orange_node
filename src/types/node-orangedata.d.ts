export type OrangeConfig = {
  apiUrl: string
  cert: Buffer
  key: Buffer
  passphrase: string
  ca: Buffer
  privateKey: Buffer
}

export class OrangeData {
  constructor(config: OrangeConfig)
  sendOrder(order: Order): Promise<any>
  sendCorrection(correction: Correction): Promise<any>
  getOrderStatus(inn: string, id: string): Promise<any>
  getCorrectionStatus(inn: string, id: string): Promise<any>
}

export type OrderConfig = {
  id: string
  inn: string
  key: string
  group: string
  type: number
  customerContact: string
  customer: string
  customerINN: string
  taxationSystem: number

  positions?: OrderPosition[]
  payments?: OrderPayment[]
  agent: any,
  userAttribute: any,
}

export type OrderPosition = {
  text: string
  quantity: number
  price: number
  tax: number
  paymentMethodType: number
  paymentSubjectType: number
  nomenclatureCode: string
  supplierINN: string
  supplierInfo: {
    phoneNumbers: string[]
    name: string
  }[]
}

export type OrderPayment = {
  type: number
  amount: number
}

export type OrderAgent = {
  agentType: number
  paymentTransferOperatorPhoneNumbers: string[]
  paymentAgentOperation: string
  paymentAgentPhoneNumbers: string[]
  paymentOperatorPhoneNumbers: string[]
  paymentOperatorName: string
  paymentOperatorAddress: string
  paymentOperatorINN: string
  supplierPhoneNumbers: string[]
}

export type OrderUserAttribute = {
  name: string
  value: string
}

export class Order {
  constructor(order: OrderConfig)
  addPosition(position: OrderPosition): Promise<Order>
  addPayment(payment: OrderPayment): Promise<Order>
  addAgent(agent: OrderAgent): Promise<Order>
  addUserAttribute(userAttribute: OrderUserAttribute): Promise<Order>
}

export class Correction {
  constructor(order: Order)
}

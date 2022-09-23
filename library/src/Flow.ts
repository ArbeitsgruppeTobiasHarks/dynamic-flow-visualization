import { mapValues } from 'lodash'
import { CommodityId } from './Network'
import { PiecewiseLinear } from './PiecewiseLinear'
import { RightConstant } from './RightConstant'

export type RatesCollection = { [commodity in CommodityId]: RightConstant }

export class Flow {
  inflow: RatesCollection[]
  outflow: RatesCollection[]
  queues: PiecewiseLinear[]

  constructor(inflow: RatesCollection[], outflow: RatesCollection[], queues: PiecewiseLinear[]) {
    this.inflow = inflow
    this.outflow = outflow
    this.queues = queues
  }

  static fromJson(json: any) {
    const inflow = json['inflow'].map((inflows: any) =>
      mapValues(inflows, (rightConstant: any) => RightConstant.fromJson(rightConstant))
    )
    const outflow = json['outflow'].map((outflows: any) =>
      mapValues(outflows, (rightConstant: any) => RightConstant.fromJson(rightConstant))
    )
    const queues = json['queues'].map((queue: any) => PiecewiseLinear.fromJson(queue))
    return new Flow(inflow, outflow, queues)
  }
}

import { elemRank } from './ArrayUtils'
import { isArrayOfNumbers } from './isArrayOfNumbers'

export class PiecewiseLinear {
  times: number[]
  values: number[]
  firstSlope: number
  lastSlope: number

  constructor(times: number[], values: number[], firstSlope: number, lastSlope: number) {
    this.times = times
    this.values = values
    this.lastSlope = lastSlope
    this.firstSlope = firstSlope
  }

  eval(at: number) {
    const rnk = elemRank(this.times, at)
    return this._evalWithRank(at, rnk)
  }

  gradient(rnk: number) {
    if (rnk === -1) return this.firstSlope
    if (rnk === this.times.length - 1) return this.lastSlope
    return (this.values[rnk + 1] - this.values[rnk]) / (this.times[rnk + 1] - this.times[rnk])
  }

  _evalWithRank(at: number, rnk: number) {
    if (rnk === -1) {
      const first_grad = this.gradient(rnk)
      return this.values[0] + (at - this.times[0]) * first_grad
    } else if (rnk === this.times.length - 1) {
      const last_grad = this.gradient(rnk)
      return this.values[this.values.length - 1] + (at - this.times[this.times.length - 1]) * last_grad
    }
    return this.values[rnk] + (at - this.times[rnk]) * this.gradient(rnk)
  }

  static fromJson(json: any) {
    if (
      !isArrayOfNumbers(json['times']) ||
      !isArrayOfNumbers(json['values']) ||
      typeof json['lastSlope'] !== 'number' ||
      typeof json['firstSlope'] !== 'number'
    ) {
      throw TypeError('Could not parse PiecewiseLinear.')
    }
    return new PiecewiseLinear(json['times'], json['values'], json['firstSlope'], json['lastSlope'])
  }
}

import { elemLRank } from "./ArrayUtils"
import { isArrayOfNumbers } from './isArrayOfNumbers'

export class RightConstant {
    times: number[]
    values: number[]

    constructor(times: number[], values: number[]) {
        this.times = times
        this.values = values
    }

    eval(at: number) {
        const rnk = elemLRank(this.times, at)
        return this._evalWithLRank(rnk)
    }

    _evalWithLRank(rnk: number) {
        if (rnk === -1) {
            return this.values[0]
        } else {
            return this.values[rnk]
        }
    }

    static fromJson(json: any) {
        if (!isArrayOfNumbers(json["times"]) || !isArrayOfNumbers(json["values"])) {
            throw TypeError("Could not parse RightConstant.")
        }
        return new RightConstant(json["times"], json["values"])
    }
}

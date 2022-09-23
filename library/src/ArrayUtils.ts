
export function elemLRank(arr: number[], x: number) {
    if (x < arr[0]) { return -1 }
    let low = 0
    let high = arr.length
    while (high > low) {
        const mid = Math.floor((high + low) / 2)
        if (x < arr[mid]) {
            high = mid
        } else { // arr[mid] <= x
            low = mid + 1
        }
    }
    return high - 1
}

export function elemRank(arr: number[], x: number) {
    if (x <= arr[0]) {
        return -1
    }

    let low = 0
    let high = arr.length
    while (high > low) {
        const mid = Math.floor((high + low) / 2)
        if (x <= arr[mid]) {
            high = mid
        } else {
            low = mid + 1
        }
    }
    return high - 1
}

export const mergeLists = (lists: number[][]) => {
    const indices = lists.map(() => 0)
    let curVal = Math.min(...lists.map(list => list[0]))
    const merged = [curVal]
    while (true) {
        let min = Infinity
        let listIndex = -1
        for (let i = 0; i < lists.length; i++) {
            if (indices[i] < lists[i].length - 1 && lists[i][indices[i] + 1] <= min) {
                min = lists[i][indices[i] + 1]
                listIndex = i
            }
        }

        if (listIndex == -1) {
            return merged
        } else {
            merged.push(min)
            indices[listIndex] += 1
        }
    }
}

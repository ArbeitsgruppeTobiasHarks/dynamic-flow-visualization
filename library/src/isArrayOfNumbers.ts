
export const isArrayOfNumbers = (value: any) => {
    if (!Array.isArray(value)) return false
    for (const entry of value) {
        if (typeof entry !== "number") return false
    }
    return true
}
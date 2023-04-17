export function mapValues<K extends string | number, V1, V2>(
  object: { [key in K]: V1 },
  fn: (value: V1, key: K) => V2
): { [key in K]: V2 } {
  return Object.keys(object).reduce((result, key) => {
    const key2 = key as K
    const result2 = result as { [key in K]: V2 }
    result2[key2] = fn(object[key2], key2)
    return result
  }, {}) as { [key in K]: V2 }
}

export function flatten<T>(array: T[][]): T[] {
  return array.reduce((result, item) => result.concat(item), [])
}

export function groupBy<T extends object>(
  obj: T,
  by: (value: T[keyof T]) => string | number
): { [g in string | number]: Array<T[keyof T]> } {
  const result: { [g in string | number]: Array<T[keyof T]> } = {}
  for (const key in obj) {
    const value = obj[key] as T[keyof T]
    const group = by(value)
    if (!result[group]) {
      result[group] = []
    }
    result[group].push(value)
  }
  return result
}

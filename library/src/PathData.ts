export const d = {
  M: (x: number, y: number) => `M${x} ${y}`,
  c: (dx1: number, dy1: number, dx2: number, dy2: number, x: number, y: number) =>
    `c${dx1} ${dy1} ${dx2} ${dy2} ${x} ${y}`,
  l: (x: number, y: number) => `l${x} ${y}`,
  L: (x: number, y: number) => `L${x} ${y}`,
  h: (x: number) => `h${x}`,
  H: (x: number) => `H${x}`,
  v: (y: number) => `v${y}`,
  m: (x: number, y: number) => `m${x} ${y}`,
  z: 'z',
  A: (rx: number, ry: number, xAxisRotation: number, largeArcFlag: 0 | 1, sweepFlag: 0 | 1, x: number, y: number) =>
    `A${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y}`,
}

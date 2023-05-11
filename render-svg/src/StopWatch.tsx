import React from 'react'
import { d } from '../../library/src/PathData'

export const StopWatch = ({
  t,
  y,
  x,
  size,
  strokeWidth,
  maxT
}: {
  t: number
  y: number
  x: number
  size: number
  strokeWidth: number
  maxT: number
}) => {
  const cx = x + size / 2
  const cy = y + size / 2
  const radius = size / 2
  const pointerDegree = (t / maxT) * 360
  const pointerRadians = (t / maxT) * 2 * Math.PI
  return (
    <>
      <path
        d={d.M(cx, y) + d.v(-0.125 * size) + d.h(-0.075 * size) + d.h(0.15 * size)}
        fill="none"
        stroke="black"
        strokeWidth={size / 20}
      />
      <path
        transform={`rotate(30 ${cx} ${cy})`}
        d={d.M(cx, y) + d.v(-0.075 * size) + d.h(-0.05 * size) + d.h(0.1 * size)}
        fill="none"
        stroke="black"
        strokeWidth={size / 20}
      />
      <circle cx={cx} cy={cy} r={size / 2} stroke="none" fill="white" />
      <path
        d={
          d.M(cx, cy - radius) +
          d.A(
            radius,
            radius,
            0,
            pointerDegree % 360 > 180 ? 1 : 0,
            1,
            cx + radius * Math.sin(pointerRadians),
            cy - radius * Math.cos(pointerRadians)
          ) +
          d.L(cx, cy) +
          d.z
        }
        fill="#f99"
      />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((degree) => (
        <line
          key={degree}
          transform={`rotate(${degree} ${cx} ${cy})`}
          x1={cx}
          x2={cx}
          y1={y}
          y2={y + size / 10}
          stroke="gray"
          strokeWidth={strokeWidth}
        />
      ))}
      <circle cx={cx} cy={cy} r={size / 15} fill="black" />
      <circle cx={cx} cy={cy} r={size / 2} stroke="black" strokeWidth={strokeWidth} fill="none" />
      <line
        transform={`rotate(${pointerDegree} ${cx} ${cy})`}
        x1={cx}
        x2={cx}
        y1={cy}
        y2={y + size / 6}
        stroke="black"
        strokeWidth={strokeWidth}
      />
    </>
  )
}

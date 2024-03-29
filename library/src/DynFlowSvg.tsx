import React from 'react'
import { mergeLists } from './ArrayUtils'
import { RatesCollection } from './Flow'
import { Commodity, CommodityId, EdgeId } from './Network'
import { d } from './PathData'
import { PiecewiseLinear } from './PiecewiseLinear'
import { RightConstant } from './RightConstant'

type ColorType = string

interface FlowStep {
  start: number
  end: number
  values: { color: ColorType; value: number }[]
}

export const calcOutflowSteps = (
  outflow: RatesCollection,
  commodities: { [commodity in CommodityId]: Commodity }
): FlowStep[] => {
  const outflowTimes = mergeLists(Object.values(outflow).map((pwConstant: RightConstant) => pwConstant.times))
  // Every two subsequent values in outflowTimes correspond to a flow step.
  const flowSteps = []
  for (let i = 0; i < outflowTimes.length - 1; i++) {
    // Block from i to i+1
    const start = outflowTimes[i]
    const end = outflowTimes[i + 1]
    const values = []
    for (let c of Object.keys(outflow)) {
      values.push({ color: commodities[c].color, value: outflow[c].eval(start) })
    }
    flowSteps.push({ start, end, values })
  }
  return flowSteps
}

export const splitOutflowSteps = (
  outflowSteps: FlowStep[],
  queue: PiecewiseLinear,
  transitTime: number,
  capacity: number,
  t: number
) => {
  const inEdgeSteps = []
  const tPlusTransitTime = t + transitTime

  for (let step of outflowSteps) {
    const relStart = step.start - t
    const relEnd = step.end - t

    if (step.start > tPlusTransitTime) {
      break
    }

    const inEdgeStart = Math.max(relStart, 0)
    const inEdgeEnd = Math.min(relEnd, transitTime)
    if (inEdgeStart < inEdgeEnd) {
      inEdgeSteps.push({ start: inEdgeStart, end: inEdgeEnd, values: step.values })
    }
  }

  const queueSteps: FlowStep[] = []

  const queueSize = queue.eval(t)
  if (queueSize <= 0) return { queueSteps, inEdgeSteps }

  let firstIndexInQueue = null
  for (let i = 0; i < outflowSteps.length; i++) {
    const step = outflowSteps[i]
    if (step.end >= tPlusTransitTime) {
      firstIndexInQueue = i
      break
    }
  }
  if (firstIndexInQueue === null) return { queueSteps, inEdgeSteps }

  let accSize = 0
  for (let i = firstIndexInQueue; i < outflowSteps.length; i++) {
    const step = outflowSteps[i]
    const stepCapacity = step.values.reduce((acc, comm) => acc + comm.value, 0)
    if (stepCapacity <= 0) continue

    const stepSize = stepCapacity * (step.end - Math.max(tPlusTransitTime, step.start))

    const inQueueStart = accSize / capacity
    const inQueueEnd = Math.min(accSize + stepSize, queueSize) / capacity
    queueSteps.push({
      start: -inQueueEnd,
      end: -inQueueStart,
      values: step.values.map(({ color, value }) => ({ color, value: (value / stepCapacity) * capacity }))
    })
    accSize += stepSize
    if (accSize >= queueSize) break
  }

  return { queueSteps, inEdgeSteps }
}

export const DynamicFlowSvgDefs = ({ svgIdPrefix }: { svgIdPrefix: string }) => (
  <>
    <linearGradient id={`${svgIdPrefix}fade-grad`} x1="0" y1="1" y2="0" x2="0">
      <stop offset="0" stopColor="white" stopOpacity="0.5" />
      <stop offset="1" stopColor="white" stopOpacity="0.2" />
    </linearGradient>
    <mask id={`${svgIdPrefix}fade-mask`} maskContentUnits="objectBoundingBox">
      <rect width="1" height="1" fill={`url(#${svgIdPrefix}fade-grad)`} />
    </mask>
  </>
)

type XYCoordinates = [number, number]

export const BaseEdge = ({
  multiGroup,
  translate,
  svgIdPrefix,
  waitingTimeScale,
  transitTime,
  visible,
  from,
  to,
  offset,
  strokeWidth,
  flowScale,
  capacity,
  inEdgeSteps = [],
  queueSteps = [],
  id
}: {
  multiGroup: boolean
  translate: number
  svgIdPrefix: string
  waitingTimeScale: number
  transitTime: number
  visible: boolean
  from: XYCoordinates
  to: XYCoordinates
  offset: number
  strokeWidth: number
  flowScale: number
  capacity: number
  inEdgeSteps: FlowStep[]
  queueSteps: FlowStep[]
  id: EdgeId
}) => {
  const width = flowScale * capacity
  const padding = offset
  const arrowHeadWidth = offset / 2
  const arrowHeadHeight = multiGroup ? width : 2 * width
  const delta = [to[0] - from[0], to[1] - from[1]]
  const norm = Math.sqrt(delta[0] ** 2 + delta[1] ** 2)
  // start = from + (to - from)/|to - from| * 30
  const pad = [(delta[0] / norm) * padding, (delta[1] / norm) * padding]
  const edgeStart = [from[0] + pad[0], from[1] + pad[1]]
  const deg = (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI
  //return <path d={`M${start[0]},${start[1]}L${end[0]},${end[1]}`} />
  const normOffsetted = norm - 2 * padding - arrowHeadWidth

  return (
    <g
      transform={`rotate(${deg}, ${edgeStart[0]}, ${edgeStart[1]}) translate(0 ${translate})`}
      style={{ transition: 'opacity 0.2s' }}
      opacity={visible ? 1 : 0}
      data-id={id}
    >
      <path
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        stroke="black"
        fill="lightgray"
        d={
          d.M(edgeStart[0] + normOffsetted + strokeWidth / 2, edgeStart[1] - arrowHeadHeight / 2 - strokeWidth / 2) +
          d.l(arrowHeadWidth, arrowHeadHeight / 2 + strokeWidth / 2) +
          d.l(-arrowHeadWidth, arrowHeadHeight / 2 + strokeWidth / 2) +
          d.z
        }
      />
      <rect
        x={edgeStart[0]}
        y={edgeStart[1] - width / 2}
        width={normOffsetted}
        height={width}
        fill="white"
        stroke="none"
      />
      {inEdgeSteps
        .map(({ start, end, values }, index1) => {
          const s = values.reduce((acc, { value }) => acc + value, 0) * flowScale
          let y = edgeStart[1] - s / 2
          return values.map(({ color, value }, index2) => {
            const myY = y
            y += value * flowScale
            return (
              <rect
                key={`${index1}-${index2}`}
                fill={color}
                x={edgeStart[0] + normOffsetted - (end / transitTime) * normOffsetted}
                y={myY}
                width={((end - start) / transitTime) * normOffsetted}
                height={value * flowScale}
              />
            )
          })
        })
        .flat()}
      <g mask={`url(#${svgIdPrefix}fade-mask)`}>
        {queueSteps
          .map(({ start, end, values }, index1) => {
            let x = edgeStart[0] - width
            return values
              .slice(0)
              .reverse()
              .map(({ color, value }, index2) => {
                const myX = x
                x += value * flowScale
                return (
                  <rect
                    key={`${index1}-${index2}`}
                    fill={color}
                    x={myX}
                    y={edgeStart[1] - width + start * waitingTimeScale}
                    width={value * flowScale}
                    height={(end - start) * waitingTimeScale}
                  />
                )
              })
          })
          .flat()}
      </g>
      <path
        stroke="gray"
        strokeWidth={strokeWidth}
        style={{ transition: 'opacity 0.2s' }}
        opacity={queueSteps.length > 0 ? 1 : 0}
        fill="none"
        d={d.M(edgeStart[0], edgeStart[1]) + d.c(-width / 2, 0, -width / 2, 0, -width / 2, -width)}
      />
      <rect
        strokeLinejoin="round"
        x={edgeStart[0] - strokeWidth / 2}
        y={edgeStart[1] - width / 2 - strokeWidth / 2}
        width={normOffsetted + strokeWidth}
        height={width + strokeWidth}
        stroke="black"
        strokeWidth={strokeWidth}
        fill="none"
      />
    </g>
  )
}

export const FlowEdge = ({
  flowScale,
  id,
  translate,
  multiGroup,
  waitingTimeScale,
  strokeWidth,
  svgIdPrefix,
  from,
  to,
  outflowSteps,
  queue,
  t,
  capacity,
  transitTime,
  visible = true,
  offset
}: {
  flowScale: number
  id: EdgeId
  translate: number
  multiGroup: boolean
  waitingTimeScale: number
  strokeWidth: number
  svgIdPrefix: string
  from: XYCoordinates
  to: XYCoordinates
  outflowSteps: FlowStep[]
  queue: PiecewiseLinear
  t: number
  capacity: number
  transitTime: number
  visible?: boolean
  offset: number
}) => {
  const { inEdgeSteps, queueSteps } = splitOutflowSteps(outflowSteps, queue, transitTime, capacity, t)

  return (
    <BaseEdge
      strokeWidth={strokeWidth}
      offset={offset}
      translate={translate}
      multiGroup={multiGroup}
      waitingTimeScale={waitingTimeScale}
      svgIdPrefix={svgIdPrefix}
      visible={visible}
      from={from}
      to={to}
      id={id}
      transitTime={transitTime}
      flowScale={flowScale}
      capacity={capacity}
      inEdgeSteps={inEdgeSteps}
      queueSteps={queueSteps}
    />
  )
}

export const Vertex = ({
  label,
  pos,
  visible = true,
  radius,
  strokeWidth
}: {
  label: string
  pos: XYCoordinates
  visible?: boolean
  radius: number
  strokeWidth: number
}) => {
  const [cx, cy] = pos
  return (
    <g style={{ transition: 'opacity 0.2s' }} opacity={visible ? 1 : 0}>
      <circle cx={cx} cy={cy} r={radius} stroke="black" strokeWidth={strokeWidth} fill="white" />
      {label !== null ? (
        <text
          x={cx}
          y={cy}
          style={{
            textAnchor: 'middle',
            dominantBaseline: 'central',
            fontSize: radius,
            userSelect: 'none'
          }}
        >
          {label}
        </text>
      ) : null}
    </g>
  )
}

export const ForeignObjectLabel = ({
  cx,
  cy,
  width = 40,
  height = 40,
  children
}: {
  cx: number
  cy: number
  width: number
  height: number
  children: React.ReactNode
}) => (
  <foreignObject x={cx - width / 2} y={cy - height / 2} width={width} height={height}>
    <div style={{ width, height, display: 'grid', justifyContent: 'center', alignItems: 'center' }}>{children}</div>
  </foreignObject>
)

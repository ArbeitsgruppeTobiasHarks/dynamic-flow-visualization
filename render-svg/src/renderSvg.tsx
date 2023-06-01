import * as React from 'react'
import ReactDOMServer from 'react-dom/server'

import svgo from 'svgo'
import { ReactElement, ReactNode } from 'react'
import { calcOutflowSteps, FlowEdge, Vertex, PiecewiseLinear } from 'dynamic-flow-visualization'
import fs from 'fs'
import path from 'path'

import { Flow, Network } from 'dynamic-flow-visualization'
import sampleData from 'samples/json/TinyDynamicCapacity.json'
import TimeAxis from './TimeAxis'
import { StopWatch } from './StopWatch'

export const network = Network.fromJson(sampleData['network'])
export const flow = Flow.fromJson(sampleData['flow'])

const outflowSteps = flow.outflow.map((outflow) => calcOutflowSteps(outflow, network.commoditiesMap))
const s = network.nodesMap['s']
const t = network.nodesMap['t']
const s0Pos: [number, number] = [-0.5, 0]
const sPos: [number, number] = [s.x, s.y]
const tPos: [number, number] = [t.x, t.y]

const offset = 0.2
const radius = 0.1
const strokeWidth = 0.01

const flowScale = 0.01575

const left = s0Pos[0] - 0.2 + offset + radius
const width = tPos[0] + 0.2 - left
const top = sPos[1] - 1
const height = sPos[1] + 0.2 + 0.5 - top

const scaledWidth = 300
const scaledHeight = (height / width) * scaledWidth

export const DynamicFlowSvgDefs = ({ svgIdPrefix }: { svgIdPrefix: string }) => (
  <mask id={`${svgIdPrefix}fade-mask`} maskContentUnits="objectBoundingBox">
    <rect width="1" height="1" fill="#fff" />
  </mask>
)

const fontSize = radius / 2

const SvgContent = ({ t }: { t: number }) => {
  const svgIdPrefix = ''
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      baseProfile="full"
      viewBox={`${left} ${top} ${width} ${height}`}
      width={scaledWidth}
      height={scaledHeight}
    >
      <StopWatch
        t={t}
        x={left + strokeWidth}
        y={top + strokeWidth + height / 20}
        size={height / 10}
        maxT={16.5}
        strokeWidth={strokeWidth}
      />
      <FlowEdge
        svgIdPrefix={svgIdPrefix}
        outflowSteps={calcOutflowSteps(flow.inflow[0], network.commoditiesMap)}
        from={s0Pos}
        to={sPos}
        capacity={network.edgesMap[0].capacity}
        transitTime={5}
        queue={new PiecewiseLinear([0], [0], 0, 0)}
        t={t}
        strokeWidth={strokeWidth}
        flowScale={flowScale}
        waitingTimeScale={0.75}
        offset={radius + strokeWidth}
        multiGroup={true}
        translate={0}
        id={0}
      />
      <FlowEdge
        svgIdPrefix={svgIdPrefix}
        outflowSteps={outflowSteps[0]}
        from={sPos}
        to={tPos}
        capacity={network.edgesMap[0].capacity}
        transitTime={network.edgesMap[0].transitTime}
        queue={flow.queues[0]}
        t={t}
        strokeWidth={strokeWidth}
        flowScale={flowScale}
        waitingTimeScale={0.75}
        offset={offset}
        multiGroup={false}
        translate={0}
        id={0}
      />
      <Vertex pos={sPos} radius={radius} strokeWidth={strokeWidth} label="" />
      <Label pos={sPos}>$s$</Label>
      <Vertex pos={tPos} radius={radius} strokeWidth={strokeWidth} label="" />
      <Label pos={tPos}>$t$</Label>
      <TimeAxis
        {...{
          t,
          strokeWidth,
          fontSize,
          timeFrom: 0,
          timeTo: 16.5,
          yPos: 0.5,
          xPosStart: left,
          xPosEnd: left + width - 0.4,
          redIntervals: [
            [6, 6.5],
            [12, 12.5]
          ]
        }}
      />
    </svg>
  )
}

const Label = ({ pos, children }: { pos: [number, number]; children: ReactNode }) => (
  <text x={pos[0]} y={pos[1]} alignmentBaseline="middle" textAnchor="middle" fontSize={fontSize}>
    {String.raw`\raisebox{-.5\totalheight}{${children}}`}
  </text>
)

const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)

const times = range(0, 16.5, 0.5)

const figures = times.reduce((acc: { [path: string]: ReactElement }, t, i) => {
  acc[`train-example${i}.svg`] = <SvgContent t={t} />
  return acc
}, {})

const dir = 'build/'
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}
for (const [filename, element] of Object.entries(figures)) {
  let renderedSvgString = ReactDOMServer.renderToStaticMarkup(element as ReactElement)
  renderedSvgString = svgo.optimize(renderedSvgString).data
  fs.writeFileSync(path.join(dir, filename), renderedSvgString)
}

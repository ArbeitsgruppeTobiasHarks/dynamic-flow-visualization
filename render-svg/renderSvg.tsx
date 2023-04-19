import * as React from 'react'
import ReactDOMServer from 'react-dom/server'

import svgo from 'svgo'
import { ReactElement, ReactNode } from 'react'
import { calcOutflowSteps, FlowEdge, Vertex, PiecewiseLinear } from 'dynamic-flow-visualization'
import fs from 'fs'
import path from 'path'

import { Flow, Network } from 'dynamic-flow-visualization'
import sampleData from 'samples/json/TinyDynamicCapacity.json'

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
  <>
    <linearGradient id={`${svgIdPrefix}fade-grad`} x1="0" y1="1" y2="0" x2="0">
      <stop offset="0" stopColor="white" stopOpacity="1" />
      <stop offset="1" stopColor="white" stopOpacity="1" />
    </linearGradient>
    <mask id={`${svgIdPrefix}fade-mask`} maskContentUnits="objectBoundingBox">
      <rect width="1" height="1" fill="#fff" />
    </mask>
  </>
)

const arrowLength = 0.05

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
      <TimeAxis t={t} />
    </svg>
  )
}

const TimeAxis = ({ t }: { t: number }) => {
  const xStart = left
  const t0 = 0

  const xEnd = left + width - 0.4
  const t1 = 16.5

  const x = xStart + ((t - t0) / (t1 - t0)) * (xEnd - xStart)
  const train1X = xStart + ((6 - t0) / (t1 - t0)) * (xEnd - xStart)
  const train2X = xStart + ((12 - t0) / (t1 - t0)) * (xEnd - xStart)

  const yAxis = 0.5
  const tickSize = 0.08
  const loadingInterval = 0.5
  const loadingSize = (loadingInterval / (t1 - t0)) * (xEnd - xStart)

  return (
    <>
      <path
        strokeLinejoin="round"
        strokeLinecap="round"
        d={`M${xStart} ${yAxis} H ${xEnd} l ${-arrowLength} ${arrowLength} m ${arrowLength} ${-arrowLength} l ${-arrowLength} ${-arrowLength}`}
        fill="none"
        strokeWidth={strokeWidth}
        stroke="black"
      />
      <text x={x} y={yAxis - 2 * tickSize} alignmentBaseline="baseline" textAnchor="middle" fontSize={radius / 2}>
        {String.raw`\raisebox{-.5\totalheight}{$\theta$}`}
      </text>
      <path
        strokeLinejoin="round"
        strokeLinecap="round"
        d={`M ${train1X} ${yAxis - tickSize / 2} v ${tickSize} h ${loadingSize} v ${-tickSize} z`}
        fill="red"
        strokeWidth={strokeWidth}
        stroke="red"
      />
      <path
        strokeLinejoin="round"
        strokeLinecap="round"
        d={`M ${train2X} ${yAxis - tickSize / 2} v ${tickSize} h ${loadingSize} v ${-tickSize} z`}
        fill="red"
        strokeWidth={strokeWidth}
        stroke="red"
      />

      <path
        strokeLinejoin="round"
        strokeLinecap="round"
        d={`M ${x} ${yAxis - tickSize / 2} v ${tickSize}`}
        fill="none"
        strokeWidth={strokeWidth}
        stroke="black"
      />

      <text x={xEnd + 0.05} y={yAxis} alignmentBaseline="middle" textAnchor="start" fontSize={radius / 2}>
        {String.raw`\raisebox{-.5\totalheight}{Zeit}`}
      </text>
    </>
  )
}

const Label = ({ pos, children }: { pos: [number, number]; children: ReactNode }) => (
  <text x={pos[0]} y={pos[1]} alignmentBaseline="middle" textAnchor="middle" fontSize={radius / 2}>
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

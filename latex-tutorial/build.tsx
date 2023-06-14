import ReactDOMServer from 'react-dom/server'

import svgo from 'svgo'
import { EdgesCoordinator } from 'dynamic-flow-visualization'
import fs from 'fs'
import path from 'path'

import { Flow, Network } from 'dynamic-flow-visualization'

// The path to the JSON file containing the flow and network data
const jsonPath = '../samples/json/DPEFourNodes.json'

const parsedJson = JSON.parse(fs.readFileSync(jsonPath, { encoding: 'utf-8' }))

export const network = Network.fromJson(parsedJson['network'])
export const flow = Flow.fromJson(parsedJson['flow'])

const height = 4
const width = 4
const left = -1
const top = -1

const scaledWidth = 300
const scaledHeight = (height / width) * scaledWidth

// The stroke width as well as the properties of EdgesCoordinator and LaTeXVertex were
// manually chosen for the DPEFourNodes example.
// Adjust them to fit your flow/network properties.
const strokeWidth = 0.01

const SvgContent = ({ t }: { t: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      baseProfile="full"
      // By default, the LaTeX svg package ignores the svg viewbox and width, height arguments.
      // To make it use these attributes, use the following command in your TeX:
      // \includesvg[inkscapearea=page, ...]{/path/to/svg}
      viewBox={`${left} ${top} ${width} ${height}`}
      width={scaledWidth}
      height={scaledHeight}
    >
      <EdgesCoordinator
        flow={flow}
        waitingTimeScale={0.3}
        edgeOffset={0.3}
        flowScale={0.1}
        strokeWidth={strokeWidth}
        svgIdPrefix=""
        network={network}
        t={t}
      />
      {Object.keys(network.nodesMap).map((key) => {
        const node = network.nodesMap[key]
        return (
          <LaTeXVertex key={key} pos={[node.x, node.y]} radius={0.1} strokeWidth={strokeWidth}>
            {node.label === undefined ? key : node.label}
          </LaTeXVertex>
        )
      })}
    </svg>
  )
}

const LaTeXVertex = ({
  pos,
  radius,
  strokeWidth,
  children
}: {
  pos: [number, number]
  radius: number
  strokeWidth: number
  children: string
}) => {
  return (
    <g>
      <circle cx={pos[0]} cy={pos[1]} r={radius} stroke="black" strokeWidth={strokeWidth} fill="white" />
      {children !== null ? (
        <text
          x={pos[0]}
          y={pos[1]}
          alignmentBaseline="middle"
          textAnchor="middle"
          fontSize={0} // LaTeX will handle font size. Use the usual TeX commands to adjust font size.
        >
          {
            // we use \raisebox{-.5\totalheight} to vertically center the content around pos[1].
            String.raw`\raisebox{-.5\totalheight}{${children}}`
          }
        </text>
      ) : null}
    </g>
  )
}

const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)

// Create an svg for each time stamp in the following range
const times = range(0, 17, 1)

const dir = 'build/'
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}
for (let i = 0; i < times.length; i++) {
  const time = times[i]
  const filename = `step-${i}.svg`
  const renderedSvgString = ReactDOMServer.renderToStaticMarkup(<SvgContent t={time} />)
  const optimizedSvgString = svgo.optimize(renderedSvgString).data
  fs.writeFileSync(path.join(dir, filename), optimizedSvgString)
}

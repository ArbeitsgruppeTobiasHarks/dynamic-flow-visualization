import React from 'react'
import { calcOutflowSteps, FlowEdge } from './DynFlowSvg'
import { Flow } from './Flow'
import { Edge, Network } from './Network'
import { groupBy } from './utils'

const useOutflowSteps = (flow: Flow, network: Network) =>
  React.useMemo(
    () => flow.outflow.map((outflow: any) => calcOutflowSteps(outflow, network.commoditiesMap)),
    [flow, network]
  )

const useEdgesWithViewOpts = (flow: Flow, network: Network, strokeWidth: number, flowScale: number) =>
  React.useMemo(() => {
    const grouped = groupBy(network.edgesMap, ({ from, to }) => JSON.stringify(from < to ? [from, to] : [to, from]))
    const result = []
    for (const group of Object.values(grouped) as Edge[][]) {
      group.sort((a, b) => (a.from < b.from ? -1 : 1))
      const totalCapacity = group.reduce((acc, edge) => acc + edge.capacity, 0)
      let translate = (-totalCapacity * flowScale) / 2 - (strokeWidth * (group.length + 1)) / 2
      for (const edge of group) {
        const edgeTranslate = translate + (edge.capacity * flowScale) / 2 + strokeWidth / 2
        translate += edge.capacity * flowScale + strokeWidth
        result.push({
          translate: edgeTranslate * (edge.from < edge.to ? -1 : 1),
          edge,
          multiGroup: group.length > 1
        })
      }
    }
    return result
  }, [flow, network, strokeWidth, flowScale])

export const EdgesCoordinator = (props: {
  network: Network
  waitingTimeScale: number
  strokeWidth: number
  flowScale: number
  svgIdPrefix: string
  edgeOffset: number
  flow: Flow
  t: number
}) => {
  const nodesMap = props.network.nodesMap
  const outflowSteps = useOutflowSteps(props.flow, props.network)

  const edgesWithViewOpts = useEdgesWithViewOpts(props.flow, props.network, props.strokeWidth, props.flowScale)

  return (
    <>
      {edgesWithViewOpts.map(
        ({ edge, translate, multiGroup }: { edge: Edge; translate: number; multiGroup: boolean }) => {
          const fromNode = nodesMap[edge.from]
          const toNode = nodesMap[edge.to]
          return (
            <FlowEdge
              id={edge.id}
              waitingTimeScale={props.waitingTimeScale}
              strokeWidth={props.strokeWidth}
              flowScale={props.flowScale}
              translate={translate}
              multiGroup={multiGroup}
              key={edge.id}
              t={props.t}
              capacity={edge.capacity}
              offset={props.edgeOffset}
              from={[fromNode.x, fromNode.y]}
              to={[toNode.x, toNode.y]}
              svgIdPrefix={props.svgIdPrefix}
              outflowSteps={outflowSteps[edge.id]}
              transitTime={edge.transitTime}
              queue={props.flow.queues[edge.id]}
            />
          )
        }
      )}
    </>
  )
}

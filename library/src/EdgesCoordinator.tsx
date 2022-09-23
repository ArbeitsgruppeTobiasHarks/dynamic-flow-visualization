import { flatten, groupBy, map, sortBy, sum } from 'lodash'
import React from 'react'
import { calcOutflowSteps, FlowEdge } from './DynFlowSvg'
import { Flow } from './Flow'
import { Edge, Network } from './Network'

const useOutflowSteps = (flow: Flow, network: Network) =>
  React.useMemo(
    () => flow.outflow.map((outflow: any) => calcOutflowSteps(outflow, network.commoditiesMap)),
    [flow, network]
  )

const useEdgesWithViewOpts = (flow: Flow, network: Network, strokeWidth: number, flowScale: number) =>
  React.useMemo(() => {
    const grouped = groupBy(network.edgesMap, ({ from, to }) => JSON.stringify(from < to ? [from, to] : [to, from]))
    return flatten(
      map(grouped, (group) => {
        const sorted = sortBy(group, (edge) => edge.from)
        const totalCapacity = sum(group.map((edge) => edge.capacity))
        let translate = (-totalCapacity * flowScale) / 2 - (strokeWidth * (group.length + 1)) / 2
        return sorted.map((edge) => {
          const edgeTranslate = translate + (edge.capacity * flowScale) / 2 + strokeWidth / 2
          translate += edge.capacity * flowScale + strokeWidth
          return {
            translate: edgeTranslate * (edge.from < edge.to ? -1 : 1),
            edge,
            multiGroup: group.length > 1
          }
        })
      })
    )
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
  const outflowSteps = useOutflowSteps(props.flow, props.network)

  const edgesWithViewOpts = useEdgesWithViewOpts(props.flow, props.network, props.strokeWidth, props.flowScale)

  return (
    <>
      {map(
        edgesWithViewOpts,
        ({ edge, translate, multiGroup }: { edge: Edge; translate: number; multiGroup: boolean }) => {
          const fromNode = props.network.nodesMap[edge.from]
          const toNode = props.network.nodesMap[edge.to]
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

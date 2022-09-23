import { map } from "lodash"
import React from "react"
import { SvgDefs, Vertex } from "./DynFlowSvg"
import { EdgesCoordinator } from "./EdgesCoordinator"
import { Flow } from "./Flow"
import { Network } from "./Network"


export const DynamicFlowSvg = (
    { t = 0, svgIdPrefix = "", network, flow, nodeRadius, edgeOffset, strokeWidth, flowScale, waitingTimeScale }:
        { t: number, svgIdPrefix?: string, network: Network, flow: Flow, nodeRadius: number, edgeOffset: number, strokeWidth: number, flowScale: number, waitingTimeScale: number }
) => {
    return <>
        <SvgDefs svgIdPrefix={svgIdPrefix} />
        <EdgesCoordinator network={network} waitingTimeScale={waitingTimeScale} strokeWidth={strokeWidth} flowScale={flowScale}
            svgIdPrefix={svgIdPrefix} edgeOffset={edgeOffset} flow={flow} t={t} />
        {
            map(network.nodesMap, (value, id) => {
                return <Vertex key={id} strokeWidth={strokeWidth} radius={nodeRadius} pos={[value.x, value.y]} label={value.label ?? value.id.toString()} />
            })
        }
    </>
}

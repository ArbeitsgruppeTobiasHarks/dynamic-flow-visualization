export type IdType = number | string
export type NodeId = IdType
export type EdgeId = number
export type CommodityId = IdType

export class Network {
    nodesMap: { [id in NodeId]: NetNode }
    edgesMap : { [id in EdgeId]: Edge }
    commoditiesMap: { [id in CommodityId]: Commodity}

    constructor(nodesMap: { [id in NodeId]: NetNode }, edgesMap: { [id in EdgeId]: Edge }, commoditiesMap: { [id in CommodityId]: Commodity}) {
        this.nodesMap = nodesMap
        this.edgesMap = edgesMap
        this.commoditiesMap = commoditiesMap
    }

    static fromJson(json: any) {
        const nodes: NetNode[] = json["nodes"]
        const edges: Edge[] = json["edges"]
        const commodities: Commodity[] = json["commodities"]
        const nodesMap = nodes.reduce<{ [id in NodeId]: NetNode }>((acc, node) => {
            acc[node.id] = node
            return acc
        }, {})
        const edgesMap = edges.reduce<{ [id in EdgeId]: Edge }>((acc, edge) => {
            acc[edge.id] = edge
            return acc
        }, {})
        const commoditiesMap = commodities.reduce<{ [id in CommodityId]: Commodity }>((acc, comm) => {
            acc[comm.id] = comm
            return acc
        }, {})
        return new Network(nodesMap, edgesMap, commoditiesMap)
    }
}

export interface NetNode {
    id: NodeId
    label?: string
    x: number
    y: number
}

export interface Edge {
    id: EdgeId
    from: NodeId
    to: NodeId
    capacity: number
    transitTime: number    
}

export interface Commodity {
    id: CommodityId
    color: string    
}
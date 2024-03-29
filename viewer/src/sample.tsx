import { Flow, Network } from 'dynamic-flow-visualization'
import sampleData from 'samples/json/DPEFourNodes.json'

export const network = Network.fromJson(sampleData['network'])
export const flow = Flow.fromJson(sampleData['flow'])

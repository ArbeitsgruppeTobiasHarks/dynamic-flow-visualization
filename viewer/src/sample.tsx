import { Flow, Network } from 'dynamic-flow-visualization'
import sampleData from './sampleFlowData.json'

export const network = Network.fromJson(sampleData['network'])
export const flow = Flow.fromJson(sampleData['flow'])

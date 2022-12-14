import { Flow, Network } from 'dynamic-flow-visualization'
import * as _ from 'lodash'

import example3FlowData from './example3FlowData.js'

export const network = Network.fromJson({
  nodes: [
    { id: 's', x: 25, y: 250 },
    { id: 'v1', x: 25 + 200, y: 250 },
    { id: 't', x: 25 + 400, y: 250 },
    { id: 'v3', x: 25, y: 250 + 200 },
    { id: 'v4', x: 25 + 400, y: 250 + 200 }
  ],
  edges: [
    { id: 0, from: 's', to: 'v1', capacity: 20, transitTime: 200 },
    { id: 1, from: 'v1', to: 't', capacity: 10, transitTime: 200 },
    { id: 2, from: 's', to: 'v3', capacity: 20, transitTime: 200 },
    { id: 3, from: 'v3', to: 'v4', capacity: 20, transitTime: 400 },
    { id: 4, from: 'v4', to: 't', capacity: 20, transitTime: 200 }
  ],
  commodities: [{ id: 0, color: 'red' }]
})

export const flow = Flow.fromJson(example3FlowData)

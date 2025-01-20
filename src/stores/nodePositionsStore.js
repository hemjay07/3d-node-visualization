// stores/nodePositionsStore.js
import { create } from 'zustand'

export const useNodePositionsStore = create((set) => ({
  animatedPositions: new Map(),
  updateNodePosition: (groupId, nodeId, position) => 
    set((state) => ({
      animatedPositions: new Map(state.animatedPositions).set(`${groupId}-${nodeId}`, position)
    }))
}))
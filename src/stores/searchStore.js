// src/stores/searchStore.js
import { create } from 'zustand'

export const useSearchStore = create((set) => ({
  searchQuery: '',
  selectedNodeGroup: null,
  selectedNode: null,
  isTransitioning: false,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedNodeGroup: (group) => set({ selectedNodeGroup: group }),
  setSelectedNode: (node) => set({ selectedNode: node }),
  setIsTransitioning: (status) => set({ isTransitioning: status }),
}))
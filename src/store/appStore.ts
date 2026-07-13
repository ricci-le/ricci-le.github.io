import { create } from 'zustand'
import { Note, Resource, Tag } from '../types'

interface AppState {
  notes: Note[]
  resources: Resource[]
  tags: Tag[]
  searchQuery: string
  selectedTag: string | null
  selectedCategory: string | null
  setNotes: (notes: Note[]) => void
  setResources: (resources: Resource[]) => void
  setSearchQuery: (query: string) => void
  setSelectedTag: (tag: string | null) => void
  setSelectedCategory: (category: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  notes: [],
  resources: [],
  tags: [],
  searchQuery: '',
  selectedTag: null,
  selectedCategory: null,
  setNotes: (notes) => set({ notes }),
  setResources: (resources) => set({ resources }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}))

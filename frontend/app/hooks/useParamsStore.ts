import { create } from 'zustand'

type State = {
  pageCount: number
  pageNumber: number
  pageSize: number
  searchTerm: string
  searchValue: string
  orderBy: string
  filterBy: string
}
type Action = {
  setParams: (params: Partial<State>) => void
  setSearchValue: (value: string) => void
  reset: () => void
}

const initialState: State = {
  pageCount: 1,
  pageNumber: 1,
  pageSize: 4,
  searchTerm: '',
  searchValue: '',
  orderBy: 'make',
  filterBy: 'make',
}

export const useParamsStore = create<State & Action>()((set) => ({
  ...initialState,
  setParams: (newParams: Partial<State>) => {
    set(() => {
      if (newParams.pageNumber) return { pageNumber: newParams.pageNumber }
      return { ...newParams, pageNumber: 1 }
    })
  },
  setSearchValue: (value: string) => {
    set({ searchValue: value })
  },
  reset: () => set(initialState),
}))

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  names: string[];
  companies: string[];
  categories: string[];
  stockThreshold: number;
  inactiveTimeThreshold: number;
  updateData: (names: string[], companies: string[], categories: string[]) => void;
  updateSettings: (stockThreshold: number, inactiveTimeThreshold: number) => void;
}

const useSavedData = create<State>()(
  persist(
    (set) => ({
      names: [],
      companies: [],
      categories: [],
      stockThreshold: 40,
      inactiveTimeThreshold: 15,
      updateData: (names, companies, categories) => set((state) => ({ ...state, names, companies, categories })),
      updateSettings: (stockThreshold, inactiveTimeThreshold) =>
        set((state) => ({ ...state, stockThreshold, inactiveTimeThreshold })),
    }),
    { name: 'saved-data' }
  )
);

export default useSavedData;

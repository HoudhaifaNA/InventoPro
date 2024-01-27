import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  companies: string[];
  categories: string[];
  stockThreshold: number;
  inactiveTimeThreshold: number;
  updateData: (companies: string[], categories: string[]) => void;
  updateSettings: (stockThreshold: number, inactiveTimeThreshold: number) => void;
}

const useSavedData = create<State>()(
  persist(
    (set) => ({
      companies: [],
      categories: [],
      stockThreshold: 40,
      inactiveTimeThreshold: 15,
      updateData: (companies, categories) => set((state) => ({ ...state, companies, categories })),
      updateSettings: (stockThreshold, inactiveTimeThreshold) =>
        set((state) => ({ ...state, stockThreshold, inactiveTimeThreshold })),
    }),
    { name: 'saved-data' }
  )
);

export default useSavedData;

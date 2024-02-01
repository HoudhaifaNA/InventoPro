import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  names: string[];
  companies: string[];
  categories: string[];
  expenses: string[];
  stockThreshold: number;
  inactiveTimeThreshold: number;
  updateData: (names: string[], companies: string[], categories: string[]) => void;
  updateExpenses: (expenses: string[]) => void;
  updateSettings: (stockThreshold: number, inactiveTimeThreshold: number) => void;
}

const useSavedData = create<State>()(
  persist(
    (set) => ({
      names: [],
      companies: [],
      categories: [],
      expenses: [],
      stockThreshold: 40,
      inactiveTimeThreshold: 15,
      updateData: (names, companies, categories) => set((state) => ({ ...state, names, companies, categories })),
      updateExpenses: (expenses) => set((state) => ({ ...state, expenses })),
      updateSettings: (stockThreshold, inactiveTimeThreshold) =>
        set((state) => ({ ...state, stockThreshold, inactiveTimeThreshold })),
    }),
    { name: 'saved-data' }
  )
);

export default useSavedData;

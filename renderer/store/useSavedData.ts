import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  companies: string[];
  categories: string[];
  updateData: (companies: string[], categories: string[]) => void;
}

const useSavedData = create<State>()(
  persist(
    (set) => ({
      companies: [],
      categories: [],
      updateData: (companies, categories) => set(() => ({ companies, categories })),
    }),
    { name: 'saved-data' }
  )
);

export default useSavedData;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DisplayState {
  display: 'grid' | 'list';
  updateDisplayType: (display: 'grid' | 'list') => void;
}

const useDisplay = create<DisplayState>()(
  persist(
    (set) => ({
      display: 'list',
      updateDisplayType: (display) => set(() => ({ display })),
    }),
    { name: 'display' }
  )
);

export default useDisplay;

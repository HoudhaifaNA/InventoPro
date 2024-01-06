import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DisplayState = {
  display: 'grid' | 'list';
};

type DisplayActions = {
  updateDisplayType: (display: DisplayState['display']) => void;
};

export const useDisplay = create<DisplayState & DisplayActions>()(
  persist(
    (set) => ({
      display: 'list',
      updateDisplayType: (display) => set(() => ({ display: display })),
    }),
    { name: 'display' }
  )
);

import { create } from 'zustand';

import { IModal } from '@/types';

interface State {
  modals: IModal[];
  addModal: (modal: IModal) => void;
  deleteModal: (modalsToDelete: number) => void;
}

const useModals = create<State>()((set) => ({
  modals: [],
  addModal: (modal) =>
    set((state) => {
      const updatedModals = [...state.modals, modal];

      return { modals: updatedModals };
    }),
  deleteModal: (modalsToDelete) =>
    set((state) => {
      const updatedModals = state.modals.filter((_modal, i) => i + modalsToDelete < state.modals.length);

      return { modals: updatedModals };
    }),
}));

export default useModals;

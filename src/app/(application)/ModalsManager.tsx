'use client';
import { useState } from 'react';

import Modal from '@/components/Modal';
import CancelSaleForm from './products/CancelSaleForm';

const MODALS = [
  {
    id: 'sell-product',
    title: 'Annuler la vente',
    children: CancelSaleForm,
  },
];

const ModalsManager = () => {
  const [modalsList, setModalsList] = useState(MODALS);

  const renderModals = () => {
    return modalsList.map((modal, ind) => {
      return (
        <Modal title={modal.title} key={modal.id} zIndexMultiplier={ind + 1}>
          {<modal.children />}
        </Modal>
      );
    });
  };

  return <>{renderModals()}</>;
};

export default ModalsManager;

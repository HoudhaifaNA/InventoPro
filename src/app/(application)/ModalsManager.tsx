'use client';
import { useState } from 'react';

import Modal from '@/components/Modal';
import SellProductForm from './products/SellProductForm';

const MODALS = [
  {
    id: 'sell-product',
    title: 'Vendu un produit',
    children: SellProductForm,
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

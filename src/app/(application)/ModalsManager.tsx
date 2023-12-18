'use client';
import { useState } from 'react';

import Modal from '@/components/Modal';

const MODALS = [
  {
    id: 'test-id',
    title: 'Modal 1',
    children: () => <h1>Modal 1</h1>,
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

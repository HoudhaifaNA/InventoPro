import Modal from '@/components/Modal';
import { useModals } from '@/store';

const ModalsManager = () => {
  const { modals } = useModals();

  const renderModals = () => {
    return modals.map((modal, ind) => {
      return (
        <Modal id={modal.id} title={modal.title} key={modal.id} zIndexMultiplier={ind + 1}>
          {<modal.children />}
        </Modal>
      );
    });
  };

  return <>{renderModals()}</>;
};

export default ModalsManager;

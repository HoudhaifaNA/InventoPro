import Button from '@/components/Button';
import { useModals } from '@/store';

const CloseModal = () => {
  const { deleteModal } = useModals();
  return (
    <div className='min-h-[40px]'>
      <div>
        <p className='text-base font-medium'>Etes-vous sûr de vouloir fermer modal ?</p>
      </div>
      <div className='modal-actions flex w-full items-center justify-end gap-4 border-t border-neutral-300 bg-white p-4'>
        <Button onClick={() => deleteModal(2)}>Fermer</Button>
      </div>
    </div>
  );
};

export default CloseModal;

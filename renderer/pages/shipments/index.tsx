import { nanoid } from 'nanoid';

import ShipmentsTable from '@/page-components/shipments/ShipmentTable';
import Button from '@/components/Button';
import { useModals } from '@/store';
import ShipmentForm from '@/page-components/shipments/ShipmentForm';

const ShipmentsPage = () => {
  const { addModal } = useModals((state) => state);

  const onAddModal = () => addModal({ id: nanoid(), title: 'Ajouter une expédition', children: ShipmentForm });

  return (
    <div className='space-y-4 bg-neutral-100 py-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-semibold'>Expéditions</h1>
        <Button onClick={onAddModal}>Ajouter une expédition</Button>
      </div>
      <ShipmentsTable />
    </div>
  );
};

export default ShipmentsPage;

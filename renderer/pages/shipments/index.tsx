import { nanoid } from 'nanoid';
import useSWR from 'swr';

import ShipmentsTable from '@/page-components/shipments/ShipmentTable';
import Button from '@/components/Button';
import { useModals } from '@/store';
import ShipmentForm from '@/page-components/shipments/ShipmentForm';
import { fetcher } from '@/utils/API';
import { ShipmentSelect } from 'types';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';

interface GetShipments {
  results: number;
  shipments: ShipmentSelect[];
}

const ShipmentsPage = () => {
  const { addModal } = useModals((state) => state);
  const { data, isLoading, error } = useSWR<GetShipments>('/shipments', fetcher);

  const onAddModal = () => addModal({ id: nanoid(), title: 'Ajouter une expédition', children: ShipmentForm });

  const renderContent = () => {
    if (error) {
      return <ErrorMessage error={error} />;
    } else if (isLoading) {
      return <Loading />;
    } else if (data?.shipments && data.shipments?.length > 0) {
      return <ShipmentsTable shipments={data.shipments} />;
    }
  };

  return (
    <div className='space-y-4 bg-neutral-100 py-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-semibold'>Expéditions ({data?.results || 0})</h1>
        <Button onClick={onAddModal}>Ajouter une expédition</Button>
      </div>
      {renderContent()}
    </div>
  );
};

export default ShipmentsPage;

import { useEffect } from 'react';
import { nanoid } from 'nanoid';
import useSWR from 'swr';

import ShipmentsTable from '@/page-components/shipments/ShipmentTable';
import Button from '@/components/Button';
import { useModals, useResources } from '@/store';
import ShipmentForm from '@/page-components/shipments/ShipmentForm';
import { fetcher } from '@/utils/API';
import { ShipmentWithProducts } from 'types';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';
import ConfirmationalForm from '@/components/ConfirmationalForm';

interface GetShipments {
  results: number;
  shipments: ShipmentWithProducts[];
}

const ShipmentsPage = () => {
  const { addModal } = useModals((state) => state);
  const { shipments, setResults, selectAll } = useResources((state) => state);
  const { data, isLoading, error } = useSWR<GetShipments>(shipments.fetchedUrl, fetcher);

  const onAddModal = () => addModal({ id: nanoid(), title: 'Ajouter une expédition', children: ShipmentForm });
  useEffect(() => {
    if (data) setResults('shipments', data.results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const DeleteShipmentsModal = () => {
    return (
      <ConfirmationalForm type='d-shipments' ids={shipments.selectedItems.join(',')}>
        Êtes-vous sûr de vouloir supprimer <b> {shipments.selectedItems.length} expéditions</b> ?
      </ConfirmationalForm>
    );
  };

  const onDeleteModal = () => {
    addModal({
      id: 'DELETE_PRODUCT',
      title: 'Supprimer des expéditions',
      children: DeleteShipmentsModal,
    });
  };

  const handleSelectAll = () => {
    if (data?.shipments) {
      const ids = data.shipments.map((pr) => pr.id);
      selectAll('shipments', ids);
    }
  };

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
        <h1 className='text-3xl font-semibold'>Expéditions ({shipments.results})</h1>
        <Button onClick={onAddModal}>Ajouter une expédition</Button>
      </div>
      {shipments.selectedItems.length > 0 && (
        <div className='flex items-center justify-between'>
          <span className='text-sm font-semibold'>{shipments.selectedItems.length} sélectionnez</span>
          <div className='flex gap-2'>
            <Button variant='light' onClick={handleSelectAll}>
              Sélectionnez tout
            </Button>
            <Button className='bg-red-600' onClick={onDeleteModal}>
              Supprimer
            </Button>
          </div>
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default ShipmentsPage;

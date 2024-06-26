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
        <div className='flex items-center gap-4'>
          <Button onClick={handleSelectAll}>Sélectionnez tout</Button>
          <span className='text-sm font-semibold'>{shipments.selectedItems.length} sélectionnez</span>
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default ShipmentsPage;

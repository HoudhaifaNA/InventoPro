import { useEffect } from 'react';
import useSWR from 'swr';

import SalesTable from '@/page-components/sales/SalesTable';
import Button from '@/components/Button';
import { useResources } from '@/store';
import { fetcher } from '@/utils/API';
import { SalesWithProduct } from 'types';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';

interface GetSales {
  results: number;
  sales: SalesWithProduct[];
}

const SalesPage = () => {
  const { sales, setResults, selectAll } = useResources((state) => state);
  const { data, isLoading, error } = useSWR<GetSales>(sales.fetchedUrl, fetcher);

  useEffect(() => {
    if (data) setResults('sales', data.results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSelectAll = () => {
    if (data?.sales) {
      const ids = data.sales.map((pr) => pr.id);
      selectAll('sales', ids);
    }
  };

  const renderContent = () => {
    if (error) {
      return <ErrorMessage error={error} />;
    } else if (isLoading) {
      return <Loading />;
    } else if (data?.sales && data.sales?.length > 0) {
      return <SalesTable sales={data.sales} />;
    }
  };

  return (
    <div className='space-y-4 bg-neutral-100 py-8'>
      <div className='flex items-center'>
        <h1 className='text-3xl font-semibold'>Ventes ({sales.results})</h1>
      </div>
      {sales.selectedItems.length > 0 && (
        <div className='flex items-center gap-4'>
          <Button onClick={handleSelectAll}>Sélectionnez tout</Button>
          <span className='text-sm font-semibold'>{sales.selectedItems.length} sélectionnez</span>
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default SalesPage;

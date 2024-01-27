import useSWR from 'swr';

import { fetcher } from '@/utils/API';
import StockTable from '@/page-components/stock/StockTable';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';
import { GetStock } from 'types';

const StockPage = () => {
  const { data, isLoading, error } = useSWR<GetStock>('/stats/stock', fetcher);
  const renderContent = () => {
    if (error) {
      return <ErrorMessage error={error} />;
    } else if (isLoading) {
      return <Loading />;
    } else if (data?.stock && data.stock?.length > 0) {
      return <StockTable stock={data.stock} />;
    }
  };
  return (
    <div className='space-y-4 bg-neutral-100 py-8'>
      <div className='flex items-center'>
        <h1 className='text-3xl font-semibold'>Stock ({data?.stock.length || 0})</h1>
      </div>
      {renderContent()}
    </div>
  );
};

export default StockPage;

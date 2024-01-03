import StockTable from '@/page-components/stock/StockTable';

const StockPage = () => {
  return (
    <div className='space-y-4 bg-neutral-100 py-8'>
      <h1 className='text-3xl font-semibold'>Stock</h1>
      <StockTable />
    </div>
  );
};

export default StockPage;

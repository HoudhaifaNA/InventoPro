import { Metadata } from 'next';
import ShipmentsTable from './ShipmentsTable';

export const metadata: Metadata = {
  title: 'Expéditions | InventoPro',
};

const ShipmentsPage = () => {
  return (
    <div className='space-y-4 bg-neutral-100 py-8'>
      <h1 className='text-3xl font-semibold'>Expéditions</h1>
      <ShipmentsTable />
    </div>
  );
};

export default ShipmentsPage;

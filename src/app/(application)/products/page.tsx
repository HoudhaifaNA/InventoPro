import type { Metadata } from 'next';
import Filter from './Filter';
import ProductsList from './ProductsList';

export const metadata: Metadata = {
  title: 'Produits | inventoPro',
};

const ProductsPage = () => {
  return (
    <div className='flex min-h-screen gap-4 px-2 md:px-4 lg:px-6'>
      <Filter />
      <ProductsList />
    </div>
  );
};

export default ProductsPage;

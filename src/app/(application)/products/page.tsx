import type { Metadata } from 'next';

import Filter from './Filter';
import ProductsSection from './ProductsSection';

export const metadata: Metadata = {
  title: 'Produits | inventoPro',
};

const ProductsPage = () => {
  return (
    <div className='flex h-[92%] gap-6 px-2 md:px-4 lg:px-6'>
      <Filter />
      <ProductsSection />
    </div>
  );
};

export default ProductsPage;

import type { Metadata } from 'next';

import Filter from '@/page-components/products/Filter';
import ProductsSection from '@/page-components/products/ProductsSection';

export const metadata: Metadata = {
  title: 'Produits | inventoPro',
};

const ProductsPage = () => {
  return (
    <div className='flex gap-6'>
      <Filter />
      <ProductsSection />
    </div>
  );
};

export default ProductsPage;

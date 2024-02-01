import dynamic from 'next/dynamic';

import Filter from '@/page-components/products/Filter';
import Loading from '@/components/Loading';
const ProductsSection = dynamic(() => import('@/page-components/products/ProductsSection'), {
  ssr: false,
  loading: () => <Loading />,
});

const ProductsPage = () => {
  return (
    <div className='flex gap-6'>
      <Filter />
      <ProductsSection />
    </div>
  );
};

export default ProductsPage;

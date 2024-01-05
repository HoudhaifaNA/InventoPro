import { useRef } from 'react';
import clsx from 'clsx';

import Header from './Header';
import ProductItem from './ProductItem';
import { ProductsWithShipment } from '@/types';
import Button from '@/components/Button';
import useInfinitLoading from '@/hooks/useInfinitLoading';

let display: 'grid' | 'list';
display = 'list';

const ProductsSection = () => {
  const loadMoreRef = useRef(null);

  const { records, hasNextPage } = useInfinitLoading<ProductsWithShipment>({
    endpoint: '/products?',
    countkey: 'results',
    recordsKey: 'products',
    btn: loadMoreRef,
  });

  return (
    <div className='flex flex-1 flex-col overflow-x-auto pl-0.5'>
      <Header />
      <div className='h-screen overflow-y-auto pr-1'>
        <div
          className={clsx(
            'h-full w-full overflow-auto py-4',
            display === 'grid' ? 'grid auto-rows-fr grid-cols-2 gap-4 lg:grid-cols-4' : 'flex flex-col space-y-4'
          )}
        >
          {records.map((pr, i) => {
            return <ProductItem {...pr} display={display} key={i} />;
          })}

          {hasNextPage && (
            <div ref={loadMoreRef} className='flex items-center justify-center'>
              <Button variant='light'>Plus</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;

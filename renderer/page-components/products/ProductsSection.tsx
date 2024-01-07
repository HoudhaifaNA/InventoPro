import { useEffect, useRef } from 'react';
import clsx from 'clsx';

import Header from './Header';
import ProductItem from './ProductItem';
import { ProductsWithShipment } from '@/types';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import useInfinitLoading from '@/hooks/useInfinitLoading';
import { useDisplay, useProductsUrl, useSavedData } from '@/store';

const ProductsSection = () => {
  const loadMoreRef = useRef(null);
  const display = useDisplay((state) => state.display);
  const { fetchedUrl, setResults } = useProductsUrl((state) => state);
  const { companies, categories, updateData } = useSavedData((state) => state);

  const { records, results, data, hasNextPage, error, isLoading } = useInfinitLoading<ProductsWithShipment>({
    endpoint: fetchedUrl,
    countkey: 'results',
    recordsKey: 'products',
    btn: loadMoreRef,
  });

  const companiesList = data && data['companiesList'] ? data['companiesList'] : companies;
  const categoriesList = data && data['categoriesList'] ? data['categoriesList'] : categories;

  useEffect(() => {
    if (!isLoading) setResults(results);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, isLoading]);

  useEffect(() => {
    updateData(companiesList, categoriesList);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(companiesList), JSON.stringify(categoriesList)]);

  return (
    <div className='flex flex-1 flex-col overflow-x-auto pl-0.5'>
      <Header />
      <div className='h-screen overflow-y-auto pr-1'>
        {error && <ErrorMessage error={error} />}

        <div
          className={clsx(
            'w-full overflow-auto py-4',
            display === 'grid' ? 'grid auto-rows-fr grid-cols-2 gap-4 lg:grid-cols-4' : 'flex flex-col space-y-4'
          )}
        >
          {!error &&
            records.map((product) => {
              return <ProductItem {...product} display={display} key={product.id} />;
            })}

          {hasNextPage && (
            <div ref={loadMoreRef} className='flex items-center justify-center'>
              <Button variant='light'>Plus</Button>
            </div>
          )}
          {isLoading && <Loading />}
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import clsx from 'clsx';
import useSWR from 'swr';

import Header from '../Header';
import ProductItem from './ProductItem';
import Pagination from '@/page-components/products/Pagination';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import { useDisplay, useProductsUrl, useSavedData } from '@/store';
import { fetcher } from '@/utils/API';
import { GetProducts } from '@/types';

const ProductsSection = () => {
  const display = useDisplay((state) => state.display);
  const { fetchedUrl, setResults, results } = useProductsUrl((state) => state);
  const { companies, categories, updateData } = useSavedData((state) => state);

  const { data, error, isLoading } = useSWR<GetProducts>(fetchedUrl, fetcher);
  const companiesList = data && data['companiesList'] ? data['companiesList'] : companies;
  const categoriesList = data && data['categoriesList'] ? data['categoriesList'] : categories;

  useEffect(() => {
    if (data) setResults(data.results);
  }, [data]);

  useEffect(() => {
    updateData(companiesList, categoriesList);
  }, [JSON.stringify(companiesList), JSON.stringify(categoriesList)]);

  const renderContent = () => {
    if (error) {
      return <ErrorMessage error={error} />;
    } else if (isLoading) {
      return <Loading />;
    } else if (data?.products && data?.products.length > 0) {
      return (
        <>
          <div
            className={clsx(
              'w-full overflow-auto py-4',
              display === 'grid' ? 'grid auto-rows-fr grid-cols-2 gap-4 lg:grid-cols-4' : 'flex flex-col space-y-4'
            )}
          >
            {data.products.map((product) => {
              return <ProductItem {...product} display={display} key={product.id} />;
            })}
          </div>
          <Pagination results={results} />
        </>
      );
    }
  };

  return (
    <div className='flex flex-1 flex-col overflow-x-auto pl-0.5'>
      <Header />
      <div className='h-screen overflow-y-auto pr-1'>{renderContent()}</div>
    </div>
  );
};

export default ProductsSection;

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import clsx from 'clsx';
import useSWR from 'swr';

import Header from '../Header';
import ProductItem from './ProductItem';
import Pagination from '@/page-components/products/Pagination';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import { useDisplay, useModals, useResources, useSavedData } from '@/store';
import { fetcher } from '@/utils/API';
import { GetProducts } from '@/types';
import Button from '@/components/Button';
import ConfirmationalForm from '@/components/ConfirmationalForm';

const ProductsSection = () => {
  const display = useDisplay((state) => state.display);
  const { setResults, selectAll, products } = useResources((state) => state);
  const { companies, categories, updateData } = useSavedData((state) => state);
  const { addModal } = useModals((state) => state);

  const { data, error, isLoading } = useSWR<GetProducts>(products.fetchedUrl, fetcher);
  const companiesList = data && data['companiesList'] ? data['companiesList'] : companies;
  const categoriesList = data && data['categoriesList'] ? data['categoriesList'] : categories;

  const DeleteProductsModal = () => {
    return (
      <ConfirmationalForm type='d-products' ids={products.selectedItems.join(',')}>
        Êtes-vous sûr de vouloir supprimer <b> {products.selectedItems.length} produits </b> ?
      </ConfirmationalForm>
    );
  };

  const onDeleteModal = () => {
    addModal({
      id: 'DELETE_PRODUCT',
      title: 'Supprimer des produits',
      children: DeleteProductsModal,
    });
  };

  const handleSelectAll = () => {
    if (data?.products) {
      const ids = data.products.map((pr) => pr.id);
      selectAll('products', ids);
    }
  };

  useEffect(() => {
    if (data) setResults('products', data.results);
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
          <Pagination results={products.results} />
        </>
      );
    }
  };

  return (
    <div className='flex flex-1 flex-col overflow-x-auto pl-0.5'>
      <Header />
      {products.selectedItems.length > 0 && (
        <div className='flex items-center justify-between'>
          <span className='text-sm font-semibold'>{products.selectedItems.length} sélectionnez</span>
          <div className='flex gap-2'>
            <Button variant='light' onClick={handleSelectAll}>
              Sélectionnez tout
            </Button>
            <Button className='bg-red-600' onClick={onDeleteModal}>
              Supprimer
            </Button>
          </div>
        </div>
      )}
      <div className='h-screen overflow-y-auto pr-1'>{renderContent()}</div>
    </div>
  );
};

export default ProductsSection;

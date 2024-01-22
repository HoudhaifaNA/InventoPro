import { useRouter } from 'next/router';
import useSWR from 'swr';

import ProductDetails from '@/page-components/products/ProductDetails';
import ProductThumbnail from '@/page-components/products/ProductDetails/ProductThumbnail';
import { ProductsWithShipment } from '@/types';
import { fetcher } from '@/utils/API';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';

interface ProductResponse {
  product: ProductsWithShipment;
}

const ProductDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, error } = useSWR<ProductResponse>(`/products/${id}`, fetcher);

  const renderPage = () => {
    if (error) {
      return <ErrorMessage error={error} />;
    } else if (isLoading) {
      return <Loading />;
    } else if (data?.product) {
      const { name, thumbnail, reference, category, company, shipments, stock, retailPrice, wholesalePrice } =
        data.product;
      return (
        <>
          <ProductThumbnail name={name} thumbnail={thumbnail} />
          <ProductDetails product={data.product} />
        </>
      );
    }
  };
  return <div className='flex gap-8 overflow-auto py-8'>{renderPage()}</div>;
};

export default ProductDetailsPage;

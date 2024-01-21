import ProductDetails from '@/page-components/products/ProductDetails';
import ProductThumbnail from '@/page-components/products/ProductDetails/ProductThumbnail';

const ProductDetailsPage = () => {
  return (
    <div className='flex gap-8 overflow-auto py-8'>
      <ProductThumbnail />
      <ProductDetails />
    </div>
  );
};

export default ProductDetailsPage;

import ProductDetails from './ProductDetails';
import ProductThumbnail from './ProductThumbnail';

const ProductDetailsPage = () => {
  return (
    <div className='flex gap-8 overflow-auto py-8'>
      <ProductThumbnail />
      <ProductDetails />
    </div>
  );
};

export default ProductDetailsPage;

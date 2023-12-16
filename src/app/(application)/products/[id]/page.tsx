import ProductDetails from './ProductDetails';
import ProductThumbnail from './ProductThumbnail';

const ProductDetailsPage = () => {
  return (
    <div className='flex h-[92%] gap-8 overflow-auto px-2 py-8 md:px-4 lg:px-6'>
      <ProductThumbnail />
      <ProductDetails />
    </div>
  );
};

export default ProductDetailsPage;

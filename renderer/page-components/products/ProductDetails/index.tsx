import Button from '@/components/Button';

import ProductShipments from './ProductShipments';
import { ProductsWithShipment } from '@/types';
import ProductActions from '../ProductActions';
import formatFiatValue from '@/utils/formatFiatValue';

interface ProductDetailItemProps {
  label: string;
  value: string | number;
}
interface ProductDetailsProps {
  product: ProductsWithShipment;
}

const ProductDetailItem = ({ label, value }: ProductDetailItemProps) => {
  return (
    <div className='flex w-96 gap-5 text-sm capitalize'>
      <span className='w-2/5 font-medium '>{label}:</span>
      <span className='font-semibold'>{value}</span>
    </div>
  );
};

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const { reference, category, company, shipments, stock, retailPrice, wholesalePrice } = product;

  return (
    <div className='flex flex-1 flex-col items-start gap-4 xl:flex-row'>
      <div className='flex flex-col gap-6 space-y-1.5'>
        <ProductDetailItem label='référence' value={reference || '--'} />
        <ProductDetailItem label='catégorie' value={category || '--'} />
        <ProductDetailItem label='entreprise' value={company || '--'} />
        <ProductDetailItem label='expéditions' value={shipments.length} />
        <ProductDetailItem label='stock' value={stock} />
        <ProductDetailItem label='prix en détail' value={formatFiatValue(retailPrice)} />
        <ProductDetailItem label='prix de gros' value={formatFiatValue(wholesalePrice)} />
        <div className='flex gap-2'>
          <Button>Ajouter une expédition</Button>
          <ProductActions product={product} />
        </div>
      </div>
      <ProductShipments shipments={shipments} />
    </div>
  );
};

export default ProductDetails;

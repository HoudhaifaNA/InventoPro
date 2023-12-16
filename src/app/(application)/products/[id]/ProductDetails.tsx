import Button from '@/components/Button';
import Icon from '@/components/Icon';
import ProductShipments from './ProductShipments';

interface ProductDetailItemProps {
  label: string;
  value: string;
}

const ProductDetailItem = ({ label, value }: ProductDetailItemProps) => {
  return (
    <div className='flex w-96 gap-5 text-sm capitalize'>
      <span className='w-2/5 font-medium '>{label}:</span>
      <span className='font-semibold'>{value}</span>
    </div>
  );
};

const ProductDetails = () => {
  return (
    <div className='flex flex-1 flex-col items-start gap-4 xl:flex-row'>
      <div className='flex flex-col gap-6 space-y-1.5'>
        <ProductDetailItem label='référence' value='#178F469' />
        <ProductDetailItem label='catégorie' value='générale' />
        <ProductDetailItem label='entreprise' value='ABC Electic' />
        <ProductDetailItem label='expéditions' value='173' />
        <ProductDetailItem label='stock' value='369' />
        <ProductDetailItem label='prix en détail' value='269.00 DA' />
        <ProductDetailItem label='prix de gros' value='239.00 DA' />
        <div className='flex gap-2'>
          <Button>Ajouter une expédition</Button>
          <Button variant='light'>
            <Icon icon='more_horiz' className='h-5 w-5' />
          </Button>
        </div>
      </div>
      <ProductShipments />
    </div>
  );
};

export default ProductDetails;

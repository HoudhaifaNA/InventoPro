import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@tremor/react';
import clsx from 'clsx';

import ProductActions from '../ProductActions';
import { ProductsWithShipment } from '@/types';
import formatFiatValue from '@/utils/formatFiatValue';
import { useResources } from '@/store';

interface ProductItemProps extends ProductsWithShipment {
  display: 'grid' | 'list';
}

const BulletSperator = () => <div className='h-1 w-1 rounded bg-black' />;

const ProductItem = (props: ProductItemProps) => {
  const { selectItem, products } = useResources((state) => state);

  const { display, ...product } = props;
  const { id, name, reference, thumbnail, category, shipments, company, stock, retailPrice, wholesalePrice } = product;
  const imageSrc = thumbnail ? `http://localhost:5500/api/attachments/${thumbnail}` : '/no-image.jpg';
  const isGridDisplay = display === 'grid';
  const isSelected = products.selectedItems.indexOf(id) !== -1;

  return (
    <div
      className={clsx(
        'flex gap-6 rounded bg-neutral-100 p-4 shadow-sm transition-colors',
        isGridDisplay ? 'col-span-1	flex-col' : 'h-28 w-full min-w-[1000px] flex-row items-center',
        isSelected ? 'bg-rose-200 ' : ''
      )}
      onClick={(e) => {
        e.preventDefault();
        if (e.ctrlKey) {
          selectItem('products', id);
        }
      }}
    >
      <div
        className={clsx(
          'relative overflow-hidden rounded',
          isGridDisplay ? 'h-56 min-h-[224px] w-full' : 'h-20 min-h-[80px] w-20 min-w-[80px]'
        )}
      >
        <Image src={imageSrc} alt='product' fill />
      </div>
      <div className='flex flex-1 flex-col gap-4'>
        <Link href={`/products/${id}`}>
          <p className='truncate text-sm font-semibold'>{name}</p>
        </Link>
        <span className='text-xs font-medium'>
          <b>Réf :</b> {reference || '  --'}
        </span>
        <div className='flex flex-wrap items-center gap-2 text-xs font-medium'>
          <span className='font-semibold text-neutral-500'>{category || '--'}</span>
          <BulletSperator />
          <span className='font-semibold text-neutral-500'>{company || '--'}</span>
          <BulletSperator />
          <span>{shipments.length} tranches</span>
          <BulletSperator />
          <b>{stock} en stock</b>
          {stock < 30 && (
            <>
              <BulletSperator />
              <Badge
                size='xs'
                className={clsx(stock > 0 ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600')}
              >
                <span className='text-xs'>{stock > 0 ? 'Stock faible' : 'En rupture de stock'}</span>
              </Badge>
            </>
          )}
        </div>
      </div>
      <div className='flex min-w-[25%] basis-1/4 items-end justify-between'>
        <div className='flex flex-col justify-between gap-6 text-sm'>
          <span className='whitespace-nowrap text-xs uppercase opacity-80'>Prix ​​en détail</span>
          <span className='whitespace-nowrap font-semibold'>{formatFiatValue(retailPrice)}</span>
        </div>
        <div className='flex flex-col justify-between gap-6 text-sm'>
          <span className='whitespace-nowrap text-xs uppercase opacity-80'>Prix ​​de gros</span>
          <span className='whitespace-nowrap font-semibold'>{formatFiatValue(wholesalePrice)}</span>
        </div>
      </div>
      <ProductActions product={product} multipleDisplay />
    </div>
  );
};

export default ProductItem;

import Image from 'next/image';
import { Badge } from '@tremor/react';
import clsx from 'clsx';

import { ProductsWithShipment } from '@/types';

interface ProductThumbnailProps extends Pick<ProductsWithShipment, 'name' | 'thumbnail' | 'stock'> {}

const ProductThumbnail = ({ name, thumbnail, stock }: ProductThumbnailProps) => {
  const imageSrc = thumbnail ? `http://localhost:5500/api/attachments/${thumbnail}` : '/no-image.jpg';

  return (
    <div className='flex basis-56 flex-col flex-wrap space-y-2 lg:basis-96'>
      <div className='relative h-56 w-56 overflow-hidden rounded-md lg:h-96 lg:w-96'>
        <Image src={imageSrc} alt='product' fill />
      </div>
      <h1 className='text-base font-semibold lg:text-xl'>{name}</h1>
      {stock < 30 && (
        <Badge size='xs' className={clsx(stock > 0 ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600')}>
          <span className='text-xs'>{stock > 0 ? 'Stock faible' : 'En rupture de stock'}</span>
        </Badge>
      )}
    </div>
  );
};

export default ProductThumbnail;

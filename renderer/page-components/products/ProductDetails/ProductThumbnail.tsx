import Image from 'next/image';
import { Badge } from '@tremor/react';

const ProductThumbnail = () => {
  return (
    <div className='flex basis-56 flex-col flex-wrap space-y-2 lg:basis-96'>
      <div className='relative h-56 w-56 overflow-hidden rounded-md lg:h-96 lg:w-96'>
        <Image src='/product-3.jpg' alt='product' fill />
      </div>
      <h1 className='text-base font-semibold lg:text-xl'>
        Possini Euro Carrine 38 1/2&quot; Wide Black Gold Kitchen Island Pendant
      </h1>
      {/* <Badge size='xs' className='bg-orange-100 text-orange-600'>
        <span className='text-xs'>En rupture de stock</span>
      </Badge> */}
    </div>
  );
};

export default ProductThumbnail;

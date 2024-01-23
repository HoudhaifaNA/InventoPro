import Link from 'next/link';

import { ProductsWithShipment } from '@/types';

interface ProductShipmentsProps extends Pick<ProductsWithShipment, 'shipments'> {}

const ProductShipments = ({ shipments }: ProductShipmentsProps) => {
  return (
    <div className='h-full w-full flex-1 space-y-2 overflow-y-auto'>
      {shipments.map(({ shipmentDate }, ind) => {
        return (
          <div
            className='flex items-center justify-between rounded bg-indigo-50 p-4 text-sm font-semibold text-indigo-950'
            key={ind}
          >
            <Link href='/'>
              <span className='border-b border-dashed border-indigo-950'>Tranche {ind + 1}</span>
            </Link>
            <span>{shipmentDate}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ProductShipments;

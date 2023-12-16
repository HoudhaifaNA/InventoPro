import Link from 'next/link';

const ProductShipments = () => {
  return (
    <div className='h-full w-full flex-1 space-y-2 overflow-y-auto'>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((el) => {
        return (
          <div
            className='flex items-center justify-between rounded bg-indigo-50 p-4 text-sm font-semibold text-indigo-950'
            key={el}
          >
            <Link href='/'>
              <span className='border-b border-dashed border-indigo-950'>Tranche {el}</span>
            </Link>
            <span>Jui, 1{el} 2019</span>
          </div>
        );
      })}
    </div>
  );
};

export default ProductShipments;

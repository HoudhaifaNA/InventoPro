import clsx from 'clsx';

import Header from './Header';
import ProductItem from './ProductItem';

const products = [
  {
    name: 'Possini Euro Carrine 38 1/2" Wide Black Gold Kitchen Island Pendant',
    image: 'product-1.jpg',
    category: 'General',
    company: 'Multa Electric',
    shipments: 12,
    stock: 7,
    refrence: '148F79',
    retailPrice: 14080,
    wholesalePrice: 12700,
  },
  {
    name: 'Stiffel Melvan 36 1/2" Wide Golden Bronze Ice Glass 12-Light Pendant',
    image: 'product-2.jpg',
    category: 'Electric',
    company: 'Voltage',
    shipments: 4,
    stock: 143,
    refrence: '1949FA',
    retailPrice: 19100,
    wholesalePrice: 21700,
  },
  {
    name: 'Possini Euro Caliari 22" Wide Black 6-Light Double Shade Pendant',
    image: 'product-3.jpg',
    category: 'Simple',
    company: 'Ecnocram',
    shipments: 34,
    stock: 48,
    refrence: 'EF9F314',
    retailPrice: 13500,
    wholesalePrice: 10700,
  },
  {
    name: 'Possini Euro Zia 25 1/2" Wide Black and Gold 6-Light Pendant',
    image: 'product-4.jpg',
    category: 'General',
    company: 'BMS',
    shipments: 9,
    stock: 0,
    refrence: '9315A',
    retailPrice: 3700,
    wholesalePrice: 3489,
  },
  {
    name: 'Possini Euro Carrine 38 1/2" Wide Black Gold Kitchen Island Pendant',
    image: 'product-1.jpg',
    category: 'General',
    company: 'Multa Electric',
    shipments: 12,
    stock: 7,
    refrence: '148F79',
    retailPrice: 14800,
    wholesalePrice: 12700,
  },
  {
    name: 'Stiffel Melvan 36 1/2" Wide Golden Bronze Ice Glass 12-Light Pendant',
    image: 'product-2.jpg',
    category: 'Electric',
    company: 'Voltage',
    shipments: 4,
    stock: 143,
    refrence: '1949FA',
    retailPrice: 19100,
    wholesalePrice: 21700,
  },
  {
    name: 'Possini Euro Caliari 22" Wide Black 6-Light Double Shade Pendant',
    image: 'product-3.jpg',
    category: 'Simple',
    company: 'Ecnocram',
    shipments: 34,
    stock: 48,
    refrence: 'EF9F314',
    retailPrice: 13500,
    wholesalePrice: 10700,
  },
  {
    name: 'Possini Euro Zia 25 1/2" Wide Black and Gold 6-Light Pendant',
    image: 'product-4.jpg',
    category: 'General',
    company: 'BMS',
    shipments: 9,
    stock: 0,
    refrence: '9315A',
    retailPrice: 3700,
    wholesalePrice: 3489,
  },
];

let display: 'grid' | 'list';
display = 'list';

const ProductsSection = () => {
  return (
    <div className='flex flex-1 flex-col overflow-x-auto'>
      <Header />
      <div
        className={clsx(
          'overflow-x-auto py-4',
          display === 'grid' ? 'grid auto-rows-fr grid-cols-2 gap-4 lg:grid-cols-4' : 'table space-y-4'
        )}
      >
        {products.map((pr, i) => {
          return <ProductItem {...pr} display={display} key={i} />;
        })}
      </div>
    </div>
  );
};

export default ProductsSection;

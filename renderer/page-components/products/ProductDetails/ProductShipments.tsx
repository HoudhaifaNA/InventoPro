import ShipmentActions from '@/page-components/shipments/ShipmentActions';
import { ProductsWithShipment } from '@/types';
import formatUIDate from '@/utils/formatUIDate';

interface ProductShipmentsProps {
  productShipments: ProductsWithShipment['productShipments'];
}

const ProductShipments = ({ productShipments }: ProductShipmentsProps) => {
  return (
    <div className='h-full w-full flex-1 space-y-2 overflow-y-auto'>
      {/* {productShipments.map((productShipment, ind) => {
        return (
          <div
            className='flex items-center justify-between rounded bg-indigo-50 p-4 text-sm font-semibold text-indigo-950'
            key={ind}
          >
            <span>{shipmentCode || '--'}</span>
            <span>{formatUIDate(shipmentDate)}</span>
            <ShipmentActions shipment={{ ...shipment, shipmentProducts: [rest] }} />
          </div>
        );
      })} */}
    </div>
  );
};

export default ProductShipments;

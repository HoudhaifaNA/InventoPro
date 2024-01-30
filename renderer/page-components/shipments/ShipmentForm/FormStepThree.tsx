import { useFormContext } from 'react-hook-form';

import { ShipmentFormInputs } from './types';
import { calculateExpensesTotal, calculateShipmentTotal } from 'utils/calculations';
import formatUIDate from '@/utils/formatUIDate';
import { CURRENCY_OPTIONS } from './constants';
import formatFiatValue from '@/utils/formatFiatValue';

interface ConfirmationDetailItemProps {
  label: string;
  value: string;
}

interface ConfirmationDetailCategoryProps {
  title: string;
  items: ConfirmationDetailItemProps[];
}

const ConfirmationDetailItem = ({ label, value }: ConfirmationDetailItemProps) => {
  return (
    <li className='flex items-center justify-between'>
      <span className='list-item list-inside list-disc text-sm font-semibold'>{label} :</span>
      <span className='text-sm font-medium'>{value}</span>
    </li>
  );
};

export const ConfirmationDetailCategory = ({ title, items }: ConfirmationDetailCategoryProps) => {
  return (
    <div>
      <h5 className='mb-6 text-lg font-semibold'>{title}</h5>
      <ul className='space-y-5'>
        {items.map((item, ind) => {
          return <ConfirmationDetailItem label={item.label} value={item.value} key={ind} />;
        })}
      </ul>
    </div>
  );
};

const FormStepThree = () => {
  const { getValues } = useFormContext<ShipmentFormInputs>();
  const { shipmentCode, shipmentDate, arrivalDate, productsNames, expenses, productsBought } = getValues();
  const expensesTotal = calculateExpensesTotal(expenses);
  const productsTotal = calculateShipmentTotal(productsBought);

  const CATEGORIES = [
    {
      title: 'General',
      items: [
        { label: 'ID', value: shipmentCode || '--' },
        { label: 'Dates', value: `${formatUIDate(shipmentDate)} ~ ${formatUIDate(arrivalDate)}` },
      ],
    },
    {
      title: 'Produits',
      items: productsBought.map(({ quantity, expenseSlice, totalPrice }, ind) => {
        const unitPriceFormatted = formatFiatValue(parseFloat(((totalPrice + expenseSlice) / quantity).toFixed(0)));
        const totalPriceFormatted = formatFiatValue(totalPrice + expenseSlice);
        return {
          label: `${productsNames[ind]} (${quantity}) ( ${unitPriceFormatted} )`,
          value: `${totalPriceFormatted}`,
        };
      }),
    },
    {
      title: 'Dépenses',
      items: expenses.map(({ raison, type, exr, cost_in_rmb, cost_in_usd, cost_in_dzd }) => {
        let field;
        if (type === 'RMB') field = cost_in_rmb;
        if (type === 'USD') field = cost_in_usd;
        return {
          label: raison,
          value: `${type !== 'DZD' ? `${CURRENCY_OPTIONS[type].icon}${field} × ${exr} DA =` : ''} ${formatFiatValue(
            cost_in_dzd
          )}`,
        };
      }),
    },
    {
      title: 'Totaux',
      items: [
        {
          label: 'Total des dépenses',
          value: formatFiatValue(expensesTotal),
        },
        {
          label: 'Total des produits',
          value: formatFiatValue(productsTotal),
        },
        {
          label: 'Total',
          value: formatFiatValue(expensesTotal + productsTotal),
        },
      ],
    },
  ];

  return (
    <>
      {CATEGORIES.map((cat) => {
        return <ConfirmationDetailCategory {...cat} key={cat.title} />;
      })}
    </>
  );
};

export default FormStepThree;

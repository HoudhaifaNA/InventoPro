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

const CATEGORIES = [
  {
    title: 'General',
    items: [
      { label: 'ID', value: 'EXP-41654654AFA9J' },
      { label: 'Dates', value: '15-04-2023 ~ N/A' },
    ],
  },
  {
    title: 'Produits',
    items: [
      { label: 'Lustre A/B Neo (459)', value: '17800.00 DA' },
      { label: 'Pompila Cashmir (136)', value: '49500.00 DA' },
      { label: 'Veste noir (270)', value: '1800.00 DA' },
    ],
  },
  {
    title: 'Depenses',
    items: [
      { label: "Billet d'avion", value: '$180 × 17000 DA = 22000.00 DA' },
      { label: 'Shipment dacoordo', value: '¥180 × 9000 DA = 12000.00 DA' },
      { label: "Main d'oeuvre", value: '37000.00 DA' },
    ],
  },
];

const FormStepThree = () => {
  return (
    <>
      {CATEGORIES.map((cat) => {
        return <ConfirmationDetailCategory {...cat} key={cat.title} />;
      })}
    </>
  );
};

export default FormStepThree;

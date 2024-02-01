import { useState } from 'react';
import { Badge, Select, SelectItem } from '@tremor/react';

import LabeledInput from '@/components/LabeledInput';
import NumberRangeInput from '@/components/NumberRangeInput';
import { useResources, useSavedData } from '@/store';

const Filter = () => {
  const [prevOrderBy, setOrderBy] = useState('updatedAt');
  const { addQuery, deleteQuery, products } = useResources((state) => state);
  const { categories, companies, stockThreshold } = useSavedData((state) => state);

  const addOrderByFilter = (orderBy) => {
    const orderByQuery = prevOrderBy === orderBy ? `-${orderBy}` : orderBy;

    addQuery('products', { query: 'orderBy', value: orderByQuery });
    setOrderBy(orderByQuery);
  };

  const filter = (query: string, value) => {
    if (!value || value === '_') {
      deleteQuery('products', query);
    } else {
      addQuery('products', { query, value });
    }
  };

  return (
    <div className='w-1/3 space-y-8 overflow-y-scroll border-r border-neutral-400 bg-white py-4 pl-0.5 pr-3 lg:w-1/5'>
      <div className='flex items-center justify-between py-2'>
        <span className='text-xl font-semibold'>Produits</span>
        <Badge className='bg-indigo-100 text-indigo-900'>
          <b>{products.results}</b> produits
        </Badge>
      </div>
      <div className='flex flex-col gap-8'>
        <LabeledInput label='Trier par'>
          <Select defaultValue='updatedAt' enableClear={false} onValueChange={addOrderByFilter}>
            <SelectItem value='updatedAt'>Date mise à jour</SelectItem>
            <SelectItem value='name'>Alphabétiquement</SelectItem>
            <SelectItem value='stock'>Stock</SelectItem>
            <SelectItem value='retailPrice'>Prix en details</SelectItem>
            <SelectItem value='wholesalePrice'>Prix de gros</SelectItem>
          </Select>
        </LabeledInput>
        <LabeledInput label='Entreprise'>
          <Select placeholder='Sélectionner...' defaultValue='' onValueChange={(company) => filter('company', company)}>
            {companies.map((company) => {
              return (
                <SelectItem value={company} key={company}>
                  {company}
                </SelectItem>
              );
            })}
          </Select>
        </LabeledInput>
        <LabeledInput label='Catégorie'>
          <Select
            placeholder='Sélectionner...'
            defaultValue=''
            onValueChange={(category) => filter('category', category)}
          >
            {categories.map((category) => {
              return (
                <SelectItem value={category} key={category}>
                  {category}
                </SelectItem>
              );
            })}
          </Select>
        </LabeledInput>
        <LabeledInput label='État de stock'>
          <Select
            placeholder='Sélectionner...'
            defaultValue=''
            onValueChange={(stockRange) => filter('stock', stockRange)}
          >
            <SelectItem value={`${stockThreshold}_`}>Stock élevé</SelectItem>
            <SelectItem value={`1_${stockThreshold}`}>Stock faible</SelectItem>
            <SelectItem value='_0'>En rupture de stock</SelectItem>
          </Select>
        </LabeledInput>
        <NumberRangeInput
          label='Prix ​​en détail'
          currency='dinar'
          onRangeChange={(retailPrice) => filter('retailPrice', retailPrice)}
        />
        <NumberRangeInput
          label='Prix d​e gros'
          currency='dinar'
          onRangeChange={(wholesalePrice) => filter('wholesalePrice', wholesalePrice)}
        />
      </div>
    </div>
  );
};

export default Filter;

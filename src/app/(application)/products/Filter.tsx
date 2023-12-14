import { Badge, MultiSelect, MultiSelectItem, Select, SelectItem } from '@tremor/react';

import LabeledInput from '@/components/LabeledInput';
import NumberRangeInput from '@/components/NumberRangeInput';

const Filter = () => {
  return (
    <div className='w-1/3 space-y-8 overflow-y-scroll border-r border-neutral-400 bg-white py-4 pl-0.5 pr-3 lg:w-1/5'>
      <div className='flex items-center justify-between py-2'>
        <span className='text-xl font-semibold'>Produits</span>
        <Badge className='bg-indigo-100 text-indigo-900'>
          <b>1319</b> produits
        </Badge>
      </div>
      <div className='flex flex-col gap-8'>
        <LabeledInput label='Trier par'>
          <Select defaultValue='1' enableClear={false}>
            <SelectItem value='1'>Date d&apos;expédition</SelectItem>
            <SelectItem value='2'>Alphabétiquement</SelectItem>
            <SelectItem value='2'>Prix</SelectItem>
            <SelectItem value='3'>Stock</SelectItem>
          </Select>
        </LabeledInput>
        <LabeledInput label='Entreprise'>
          <MultiSelect placeholder='Sélectionner...' placeholderSearch='Recherche'>
            <MultiSelectItem value='1'>ABC</MultiSelectItem>
            <MultiSelectItem value='2'>CED</MultiSelectItem>
            <MultiSelectItem value='3'>GAL</MultiSelectItem>
          </MultiSelect>
        </LabeledInput>
        <LabeledInput label='Catégorie'>
          <MultiSelect placeholder='Sélectionner...' placeholderSearch='Recherche'>
            <MultiSelectItem value='1'>General</MultiSelectItem>
            <MultiSelectItem value='2'>Electric</MultiSelectItem>
            <MultiSelectItem value='3'>Optimal</MultiSelectItem>
          </MultiSelect>
        </LabeledInput>
        <LabeledInput label='État de stock'>
          <MultiSelect placeholder='Sélectionner...' placeholderSearch='Recherche'>
            <MultiSelectItem value='1'>Stock élevé</MultiSelectItem>
            <MultiSelectItem value='2'>Stock faible</MultiSelectItem>
            <MultiSelectItem value='3'>En rupture de stock</MultiSelectItem>
          </MultiSelect>
        </LabeledInput>
        <NumberRangeInput label='Prix ​​en détail' currency='dinar' />
        <NumberRangeInput label='Prix d​e gros' currency='dinar' />
      </div>
    </div>
  );
};

export default Filter;

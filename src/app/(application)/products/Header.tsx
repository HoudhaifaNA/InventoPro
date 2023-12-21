'use client';
import { TextInput } from '@tremor/react';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import Switcher, { Option } from '@/components/Switcher';

const optionsList: Option[] = [
  { payload: 'list', icon: 'list_view' },
  { payload: 'grid', icon: 'grid_view' },
];

const Header = () => {
  return (
    <div className='flex items-center gap-6 py-4'>
      <div className='flex flex-1 items-center gap-2'>
        <TextInput
          className='pl-2'
          type='text'
          placeholder='Recherche...'
          icon={() => <Icon icon='search' className='h-5 w-5 opacity-60' />}
        />
        <Switcher options={optionsList} squared handleSelect={(payload) => console.log(payload)} />
      </div>
      <Button>Ajouter un produit</Button>
    </div>
  );
};

export default Header;

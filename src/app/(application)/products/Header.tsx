'use client';
import React from 'react';
import { TextInput } from '@tremor/react';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import Switcher, { Option } from '@/components/Switcher';

const optionsList: Option[] = [
  { payload: 'grid', icon: 'grid_view' },
  { payload: 'list', icon: 'list_view' },
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
        <Switcher options={optionsList} handleSelect={(payload) => console.log(payload)} />
      </div>
      <Button>Ajouter un produit</Button>
    </div>
  );
};

export default Header;

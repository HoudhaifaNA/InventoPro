'use client';
import { Divider, NumberInput, TextInput } from '@tremor/react';

import LabeledInput from '@/components/LabeledInput';

const UserSettings = () => {
  return (
    <div className='w-1/2 lg:w-1/5 '>
      <div className='space-y-4'>
        <span className='text-lg font-semibold'>General</span>
        <LabeledInput id='stock-warning' label='Avertissement de stock'>
          <NumberInput placeholder='ex: 25' min={1} />
        </LabeledInput>
        <LabeledInput id='session-timeout' label="Temps d'inactivité (minutes)">
          <NumberInput placeholder='ex: 5' min={5} />
        </LabeledInput>
      </div>
      <Divider />
      <div className='space-y-4'>
        <span className='text-lg font-semibold'>Security</span>
        <LabeledInput id='current-password' label='Mot de pass'>
          <TextInput type='password' placeholder='*******' />
        </LabeledInput>
        <LabeledInput id='new-password' label='Nouveau mot de pass'>
          <TextInput type='password' placeholder='*******' />
        </LabeledInput>
      </div>
    </div>
  );
};

export default UserSettings;

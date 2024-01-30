import { DatePicker, TextInput, NumberInput } from '@tremor/react';
import { useFormContext, Controller } from 'react-hook-form';
import { nanoid } from 'nanoid';

import Button from '@/components/Button';
import FormRow from '@/components/FormRow';
import LabeledInput from '@/components/LabeledInput';
import Icon from '@/components/Icon';
import { Currencies, ShipmentFormInputs } from './types';
import { Expense } from 'types';
import { BTN_TYPES, CURRENCY_OPTIONS } from './constants';
import { useEffect } from 'react';
import { useSavedData } from '@/store';
import SelectTextInput from '@/components/SelectTextInput';

const FormStepOne = () => {
  const { expenses: raisons } = useSavedData();
  const methods = useFormContext<ShipmentFormInputs>();

  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = methods;
  const [expenses, arrivalDate] = watch(['expenses', 'arrivalDate']);

  useEffect(() => {
    const calculatedExpenses = expenses.map((exp) => {
      const { type, cost_in_rmb, cost_in_usd, exr } = exp;
      let cost_in_dzd = exp.cost_in_dzd;
      if (type === 'RMB') cost_in_dzd = cost_in_rmb * (exr / 100);
      if (type === 'USD') cost_in_dzd = cost_in_usd * (exr / 100);
      return { ...exp, cost_in_dzd };
    });

    setValue('expenses', calculatedExpenses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(expenses)]);

  const addExpense = (currency: Currencies) => {
    let type: Expense['type'] = 'DZD';
    if (currency === 'Dollar') type = 'USD';
    if (currency === 'Renminbi') type = 'RMB';
    const newExpense: Expense = {
      id: nanoid(),
      type,
      raison: '',
      exr: 0,
      cost_in_usd: 0,
      cost_in_rmb: 0,
      cost_in_dzd: 0,
    };

    const updatedExpenses = [...expenses, newExpense];
    setValue('expenses', updatedExpenses);
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter((exp) => exp.id !== id);
    setValue('expenses', updatedExpenses);
  };

  return (
    <>
      <FormRow>
        {BTN_TYPES.map((type) => {
          return (
            <Button variant='light' icon='add' className='pl-0' key={type} onClick={() => addExpense(type)}>
              {type}
            </Button>
          );
        })}
      </FormRow>
      <FormRow>
        <LabeledInput label="Date d'arrivée :" className='flex-1'>
          <Controller
            name='arrivalDate'
            control={control}
            render={({ field: { onChange } }) => {
              return <DatePicker placeholder='Sélectionner une date' value={arrivalDate} onValueChange={onChange} />;
            }}
          />
        </LabeledInput>
        <LabeledInput id='shipment-id' label="ID d'expédition :" className='flex-1'>
          <TextInput placeholder='EXP-454654EF9A' {...register('shipmentCode')} />
        </LabeledInput>
      </FormRow>
      {expenses.map(({ id, type }, ind) => {
        const { icon, field } = CURRENCY_OPTIONS[type];
        const expError = errors.expenses && errors.expenses[ind] ? errors.expenses[ind] : null;

        return (
          <FormRow key={id}>
            <div className='basis-[49%]'>
              <SelectTextInput
                label='Raison'
                placeholder="Billet d'avion"
                name={`expenses.${ind}.raison`}
                options={raisons}
              />
            </div>
            {type !== 'DZD' && (
              <LabeledInput
                id={`exr-${ind}`}
                label={`Prix de ${icon}100 :`}
                className='flex-1'
                isError={!!expError?.exr}
                errorMessage={expError?.exr && expError?.exr.message}
              >
                <NumberInput
                  {...register(`expenses.${ind}.exr`, {
                    valueAsNumber: true,
                    required: { value: true, message: 'Taux de change est requise' },
                    min: { value: 0, message: 'Minimum est 0' },
                  })}
                  placeholder='18000'
                  min={0}
                  enableStepper={false}
                />
              </LabeledInput>
            )}
            <LabeledInput
              id='cost'
              label='Coût :'
              className='flex-1'
              isError={!!expError?.[field]}
              errorMessage={expError?.[field] && expError?.[field]?.message}
            >
              <NumberInput
                {...register(`expenses.${ind}.${field}`, {
                  valueAsNumber: true,
                  required: { value: true, message: 'Coût est requis' },
                  min: { value: 0, message: 'Minimum est 0' },
                })}
                placeholder='170'
                min={0}
                enableStepper={false}
              />
            </LabeledInput>
            <Button
              className='group-hover:animate-showDeleteBtn absolute right-0 top-8 opacity-0'
              squared
              onClick={() => deleteExpense(id)}
            >
              <Icon icon='close' className='h-5 w-5' />
            </Button>
          </FormRow>
        );
      })}
    </>
  );
};

export default FormStepOne;

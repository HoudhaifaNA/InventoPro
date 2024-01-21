import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { UseFormSetValue } from 'react-hook-form';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { AddProductFormInputs } from './types';

interface DropzoneProps {
  setValue: UseFormSetValue<AddProductFormInputs>;
}

const DropzoneSpace = ({ setValue }: DropzoneProps) => {
  const [file, setFile] = useState<File>();
  const [base64, setBase64] = useState<string>();
  const { getInputProps, getRootProps, acceptedFiles } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg'],
    },
    multiple: false,
  });

  useEffect(() => {
    setFile(acceptedFiles[0]);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function () {
        if (typeof reader.result === 'string') {
          setBase64(reader.result);
        }
      };
    });
  }, [acceptedFiles]);

  useEffect(() => {
    setValue('thumbnail', file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const resetFiles = () => {
    setFile(undefined);
  };

  return (
    <div className='flex flex-col gap-2'>
      {file && base64 && (
        <div className='group relative h-32 w-32 overflow-hidden rounded' onClick={resetFiles}>
          <div className='absolute z-10 flex h-full w-full cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'>
            <Icon icon='close' className='h-8 w-8 text-white' />
          </div>
          <Image src={base64} fill alt='thumbnail' />
        </div>
      )}
      <div {...getRootProps()}>
        <input {...getInputProps()} className='hidden' />
        <div className='flex flex-col items-center justify-center gap-4 border  border-dashed border-rose-600 py-4'>
          <Icon icon='upload' className='h-8 w-8 text-neutral-500' />
          <span>Glisser déposer</span>
          <span>ou</span>
          <Button value='light'>Parcourir des fichiers</Button>
        </div>
      </div>
    </div>
  );
};

export default DropzoneSpace;

import { Ref, forwardRef, useEffect } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';

import Button from '@/components/Button';
import Icon from '@/components/Icon';

interface DropzoneProps {
  disabled?: boolean;
}

const DROPZONE_OPTIONS: DropzoneOptions = {
  accept: {
    'image/*': ['.png', '.jpeg', '.jpg'],
  },
};

const DropzoneSpace = () => {
  const { getInputProps, getRootProps, acceptedFiles } = useDropzone(DROPZONE_OPTIONS);

  useEffect(() => {
    console.log(acceptedFiles);
  }, [acceptedFiles]);

  return (
    <div
      {...getRootProps()}
      className='flex flex-col items-center justify-center gap-4 border border-dashed border-rose-600 py-4'
    >
      <input {...getInputProps()} className='hidden' />
      <Icon icon='upload' className='h-8 w-8 text-neutral-500' />
      <span>Glisser déposer</span>
      <span>ou</span>
      <Button type='button' value='light'>
        Parcourir des fichiers
      </Button>
    </div>
  );
};

export default DropzoneSpace;

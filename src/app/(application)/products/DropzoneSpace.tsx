import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';

import Button from '@/components/Button';
import Icon from '@/components/Icon';

interface FilesWithBase64 extends File {
  base64: string;
}

const DropzoneSpace = () => {
  const [files, setFiles] = useState<FilesWithBase64[]>([]);
  const { getInputProps, getRootProps, acceptedFiles } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg'],
    },
    multiple: false,
  });

  useEffect(() => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        if (typeof reader.result === 'string') setFiles([{ ...file, base64: reader.result }]);
      };
    });
  }, [acceptedFiles]);

  const resetFiles = () => {
    setFiles([]);
  };

  return (
    <div {...getRootProps()} className=''>
      <input {...getInputProps()} className='hidden' />
      {files.length === 0 && (
        <div className='flex flex-col items-center justify-center gap-4 border  border-dashed border-rose-600 py-4'>
          <Icon icon='upload' className='h-8 w-8 text-neutral-500' />
          <span>Glisser déposer</span>
          <span>ou</span>
          <Button type='button' value='light'>
            Parcourir des fichiers
          </Button>
        </div>
      )}
      {files.map(({ base64 }, i) => (
        <div className='group relative h-32 w-32 overflow-hidden rounded' onClick={resetFiles} key={i}>
          <div className='absolute z-10 flex h-full w-full cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'>
            <Icon icon='upload' className='h-8 w-8 text-white' />
          </div>
          <Image src={base64} fill alt='thumbnail' />
        </div>
      ))}
    </div>
  );
};

export default DropzoneSpace;

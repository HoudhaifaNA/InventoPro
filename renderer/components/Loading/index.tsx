import React from 'react';

const Loading = () => {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-4'>
      <div className='h-16 w-16 animate-spin rounded-full border-4 border-indigo-700 border-r-indigo-200 p-2' />
      <h5 className='font-semibold'>Chargement...</h5>
    </div>
  );
};

export default Loading;

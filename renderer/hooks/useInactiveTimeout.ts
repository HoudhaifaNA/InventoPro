import { useEffect } from 'react';

import API from 'utils/API';
import redirectPath from '@/utils/redirectPath';
import { useSavedData } from '@/store';

const useInactiveTimeout = () => {
  const { inactiveTimeThreshold } = useSavedData();

  useEffect(() => {
    const inactiveTimeThresholdInMilliseconds = 1000 * 60 * inactiveTimeThreshold;
    let timer: NodeJS.Timeout;

    const handleInactivity = async () => {
      await API.post('/users/logout');
      redirectPath('/login');
    };

    const resetTimer = () => {
      clearTimeout(timer);

      timer = setTimeout(handleInactivity, inactiveTimeThresholdInMilliseconds);
    };

    document.addEventListener('mousedown', resetTimer);
    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('mouseup', resetTimer);
    document.addEventListener('keydown', resetTimer);
    document.addEventListener('keypress', resetTimer);
    document.addEventListener('keyup', resetTimer);

    return () => {
      document.removeEventListener('mousedown', resetTimer);
      document.removeEventListener('mousemove', resetTimer);
      document.removeEventListener('mouseup', resetTimer);
      document.removeEventListener('keydown', resetTimer);
      document.removeEventListener('keypress', resetTimer);
      document.removeEventListener('keyup', resetTimer);
    };
  }, [inactiveTimeThreshold]);
};

export default useInactiveTimeout;

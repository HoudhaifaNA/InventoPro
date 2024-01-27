import { Divider } from '@tremor/react';

import General from './General';
import Security from './Security';

const UserSettings = () => {
  return (
    <div className='w-1/2 lg:w-1/5 '>
      <General />
      <Divider />
      <Security />
    </div>
  );
};

export default UserSettings;

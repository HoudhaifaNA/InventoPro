import UserSettings from '@/page-components/settings/UserSettings';

const SettingsPage = () => {
  return (
    <div className='space-y-4 bg-neutral-100 py-8'>
      <h1 className='text-3xl font-semibold'>Stock</h1>
      <UserSettings />
    </div>
  );
};

export default SettingsPage;

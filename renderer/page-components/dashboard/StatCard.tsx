import Icon from '@/components/Icon';

interface StatCardProps {
  icon: string;
  title: string;
  mainContent: string;
  description: string;
}

const StatCard = ({ icon, title, mainContent, description }: StatCardProps) => {
  return (
    <div className='group flex h-48 w-[47%] flex-col gap-6 rounded-lg bg-white p-4 transition-all hover:w-96 hover:bg-indigo-900 hover:text-white lg:w-[22%]'>
      <div className='flex items-center gap-6'>
        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-200 transition-all group-hover:bg-indigo-950'>
          <Icon icon={icon} className='h-5 w-5 fill-black transition-all group-hover:fill-white' />
        </div>
        <span>{title}</span>
      </div>
      <span className='mb-auto text-xl font-semibold'>{mainContent}</span>
      <span className='text-sm font-normal opacity-80'>{description}</span>
    </div>
  );
};

export default StatCard;

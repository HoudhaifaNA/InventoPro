import Link from 'next/link';
import { useRouter } from 'next/router';
import { nanoid } from 'nanoid';
import clsx from 'clsx';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { LINKS } from './constants';
import { useModals } from '@/store';
import LogoutModal from './LogoutModal';

const NavbarList = () => {
  const router = useRouter();

  const renderListItems = () => {
    return LINKS.map(({ link, title, icon }) => {
      const isActive = link === router.pathname;

      const activeLinkClasses = { 'opacity-60 border-transparent': !isActive, 'border-rose-600': isActive };

      return (
        <li className={clsx('h-full border-b-4 px-2 transition-all', activeLinkClasses)} key={link}>
          <Link
            href={link}
            className='flex h-full items-center gap-2 text-sm font-semibold capitalize text-white outline-none'
          >
            <Icon icon={icon} className='h-5 w-5 fill-white' />
            <span className='hidden lg:inline'>{title}</span>
          </Link>
        </li>
      );
    });
  };
  return <ul className='flex h-full  list-none items-center gap-2 lg:gap-8'>{renderListItems()}</ul>;
};

const Navbar = () => {
  const { addModal } = useModals();

  const toggleLogoutModal = () => {
    addModal({ id: nanoid(), title: 'Déconnecter', children: LogoutModal });
  };

  return (
    <nav className='flex items-center justify-between bg-indigo-950'>
      <h1 className='text-lg font-bold text-rose-500'>inventoPro</h1>
      <NavbarList />
      <Button onClick={toggleLogoutModal}>Se déconnecter</Button>
    </nav>
  );
};

export default Navbar;

import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';

import Button from '@/components/Button';
import Icon from '@/components/Icon';

const LINKS = [
  {
    link: '/dashboard',
    title: 'tableau de bord',
    icon: 'dashboard',
  },
  {
    link: '/products',
    title: 'produits',
    icon: 'product',
  },
  {
    link: '/shipments',
    title: 'expéditions',
    icon: 'shipment',
  },
  {
    link: '/sales',
    title: 'Ventes',
    icon: 'sales',
  },
  {
    link: '/stock',
    title: 'stock',
    icon: 'stock',
  },
  {
    link: '/settings',
    title: 'paramètres',
    icon: 'settings',
  },
];

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
  return (
    <nav className='flex items-center justify-between bg-indigo-950'>
      <h1 className='text-lg font-bold text-rose-500'>inventoPro</h1>
      <NavbarList />
      <Button>Se déconnecter</Button>
    </nav>
  );
};

export default Navbar;

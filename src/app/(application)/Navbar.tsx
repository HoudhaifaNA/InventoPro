'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import Button from '@/components/Button';
import Icon from '@/components/Icon';

const LINKS = [
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
    link: '/finance',
    title: 'finance',
    icon: 'finance',
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
  const pathname = usePathname();

  const renderListItems = () => {
    return LINKS.map(({ link, title, icon }) => {
      const isActive = link === pathname;

      const activeLinkClasses = { 'opacity-60 border-transparent': !isActive, 'border-rose-600': isActive };

      return (
        <li className={clsx('h-full border-b-4 px-2 transition-all', activeLinkClasses)} key={link}>
          <Link
            href={link}
            className='flex h-full items-center gap-2 text-sm font-semibold capitalize text-white outline-none'
          >
            <Icon icon={icon} className='h-5 w-5 fill-white' />
            <span>{title}</span>
          </Link>
        </li>
      );
    });
  };
  return <ul className='flex h-full  list-none items-center gap-8'>{renderListItems()}</ul>;
};

const Navbar = () => {
  return (
    <nav className='flex h-16 items-center justify-between bg-indigo-950 px-12'>
      <h1 className='text-lg font-bold text-rose-500'>inventoPro</h1>
      <NavbarList />
      <Button>Se déconnecter</Button>
    </nav>
  );
};

export default Navbar;

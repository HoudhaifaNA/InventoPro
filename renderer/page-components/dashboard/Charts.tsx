'use client';
import { AreaChart, BarChart } from '@tremor/react';

const areaChartdata = [
  {
    date: 'Jan 22',
    'Produits achetés': 2890,
    'Produits vendus': 2338,
  },
  {
    date: 'Feb 22',
    'Produits achetés': 2756,
    'Produits vendus': 2103,
  },
  {
    date: 'Mar 22',
    'Produits achetés': 3322,
    'Produits vendus': 2194,
  },
  {
    date: 'Apr 22',
    'Produits achetés': 3470,
    'Produits vendus': 2108,
  },
  {
    date: 'May 22',
    'Produits achetés': 3475,
    'Produits vendus': 1812,
  },
  {
    date: 'Jun 22',
    'Produits achetés': 3129,
    'Produits vendus': 1726,
  },
];

const barChartdata = [
  {
    name: 'Product A',
    Ventes: 2488,
  },
  {
    name: 'Product C',
    Ventes: 1445,
  },
  {
    name: 'Product B',
    Ventes: 743,
  },
  {
    name: 'Product F',
    Ventes: 281,
  },
  {
    name: 'Product H',
    Ventes: 251,
  },
];

const Charts = () => {
  return (
    <div className='flex flex-col gap-16 md:flex-row'>
      <div className='flex-1 rounded bg-white p-4'>
        <h1>Newsletter revenue over time (USD)</h1>
        <AreaChart
          className='mt-4 h-72'
          data={areaChartdata}
          index='date'
          categories={['Produits achetés', 'Produits vendus']}
          colors={['indigo', 'cyan']}
        />
      </div>
      <div className='flex-1 rounded bg-white p-4'>
        <h1>Top 5 des produits vendus</h1>
        <BarChart
          className='mt-6'
          data={barChartdata}
          index='name'
          categories={['Ventes']}
          colors={['indigo']}
          yAxisWidth={48}
        />
      </div>
    </div>
  );
};

export default Charts;

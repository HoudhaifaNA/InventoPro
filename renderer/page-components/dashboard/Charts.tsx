import { GetStats } from '@/types';
import { AreaChart, BarChart } from '@tremor/react';

interface ChartsProps extends Pick<GetStats, 'productsStatsPerMonth' | 'topFiveProducts'> {}

const Charts = ({ productsStatsPerMonth, topFiveProducts }: ChartsProps) => {
  const areaChartdata = productsStatsPerMonth.map(({ month, purchases, sales }) => {
    return {
      Mois: month,
      'Produits achetés': purchases,
      'Produits vendus': sales,
    };
  });

  const barChartdata = topFiveProducts.map((pr) => {
    return {
      Nom: pr.name,
      Ventes: pr.salesCount,
    };
  });

  return (
    <div className='flex flex-col gap-16 md:flex-row'>
      <div className='flex-1 rounded bg-white p-4'>
        <h1>Statistiques produits par mois</h1>
        <AreaChart
          className='mt-4 h-72'
          data={areaChartdata}
          index='Mois'
          categories={['Produits achetés', 'Produits vendus']}
          colors={['indigo', 'cyan']}
        />
      </div>
      <div className='flex-1 rounded bg-white p-4'>
        <h1>Top 5 des produits vendus</h1>
        <BarChart
          className='mt-6'
          data={barChartdata}
          index='Nom'
          categories={['Ventes']}
          colors={['indigo']}
          yAxisWidth={48}
        />
      </div>
    </div>
  );
};

export default Charts;

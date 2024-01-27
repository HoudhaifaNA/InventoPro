import useSWR from 'swr';

import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';
import Charts from '@/page-components/dashboard/Charts';
import StatCard from '@/page-components/dashboard/StatCard';
import { fetcher } from '@/utils/API';
import formatFiatValue from '@/utils/formatFiatValue';
import { GetStats } from 'types';

const DashboardPage = () => {
  const { data, isLoading, error } = useSWR<GetStats>('/stats', fetcher);
  const renderContent = () => {
    if (error) {
      return <ErrorMessage error={error} />;
    } else if (isLoading) {
      return <Loading />;
    } else if (data) {
      const { productsBought, totalSales, totalExpenses, totalShipments, productsStatsPerMonth, topFiveProducts } =
        data;
      return (
        <>
          <div className='flex flex-wrap justify-between gap-4'>
            <StatCard
              icon='dashboard'
              title='Produits achetés'
              mainContent={(productsBought.total || 0).toLocaleString() + '.00 DA'}
              description={`${productsBought.quantity} (${productsBought.count}) produits achetés`}
            />
            <StatCard
              icon='dashboard'
              title='Produits vendus'
              mainContent={formatFiatValue(totalSales.total || 0)}
              description={`${totalSales.quantity} (${totalSales.count}) ventes`}
            />
            <StatCard
              icon='dashboard'
              title='Dépenses totales'
              mainContent={formatFiatValue(totalExpenses.total || 0)}
              description={`${totalExpenses.count} dépenses`}
            />
            <StatCard
              icon='dashboard'
              title='Total des expéditions'
              mainContent={formatFiatValue(totalShipments.total || 0)}
              description={`${totalShipments.count} expéditions déclarées`}
            />
          </div>
          <Charts productsStatsPerMonth={productsStatsPerMonth} topFiveProducts={topFiveProducts} />
        </>
      );
    }
  };

  return (
    <div className='space-y-8 overflow-y-auto bg-neutral-100 py-8'>
      <h1 className='text-3xl font-semibold'>Tableau de bord</h1>
      {renderContent()}
    </div>
  );
};

export default DashboardPage;

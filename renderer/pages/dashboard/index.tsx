import Charts from '@/page-components/dashboard/Charts';
import StatCard from '@/page-components/dashboard/StatCard';

const DashboardPage = () => {
  return (
    <div className='space-y-8 overflow-y-auto bg-neutral-100 py-8'>
      <h1 className='text-3xl font-semibold'>Tableau de bord</h1>
      <div className='flex flex-wrap justify-between gap-4'>
        <StatCard
          icon='dashboard'
          title='Produits achetés'
          mainContent='145.47K DA'
          description='3450 produits achetés'
        />
        <StatCard icon='dashboard' title='Produits vendus' mainContent='739.1K DA' description='1650 produits vendus' />
        <StatCard
          icon='dashboard'
          title='Dépenses totales'
          mainContent='965.52K DA'
          description='48 expéditions déclarées'
        />
        <StatCard
          icon='dashboard'
          title='Coût moyen des dépenses'
          mainContent='365.47K DA'
          description='48 expéditions déclarées'
        />
      </div>
      <Charts />
    </div>
  );
};

export default DashboardPage;

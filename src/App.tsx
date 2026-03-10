import './foundations/globals.css';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import FilterButton from '@/components/arsenal/FilterButton';
import SpecCard from '@/components/arsenal/SpecCard';
import FeatureCard from '@/components/protocols/FeatureCard';

const App = () => {
  return (
    <div className="min-h-screen bg-bg-dark text-slate-200 font-mono">
      <div className="cyber-grid" />
      <div className="mx-auto max-w-7xl px-6 py-16 space-y-12 relative z-10">
        <PageHeader
          eyebrow="AEGIS_SYSTEM"
          titleMain="DESIGN"
          titleAccent="SYSTEM"
          description="Tokens, tactical UI primitives, and Storybook-documented modules extracted from the portfolio."
        />

        <section className="grid gap-6 md:grid-cols-3">
          <StatCard id="01" label="Tokens" value="7 CORE" progress={100} />
          <StatCard id="02" label="Components" value="11 PORTED" progress={82} />
          <StatCard id="03" label="Storybook" value="ACTIVE" progress={100} segmented />
        </section>

        <section className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <FilterButton active label="Foundation" />
            <FilterButton label="Components" />
            <FilterButton label="Patterns" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <SpecCard
              title="Visual Language"
              subtitle="HUD :: TERMINAL :: OPS"
              img="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=640&q=80"
            />
            <FeatureCard id="P-01" icon="deployed_code" title="SYSTEM EXTRACTION" status="READY" dots={4}>
              Reusable presentation primitives aligned to the production site and existing stories.
            </FeatureCard>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;

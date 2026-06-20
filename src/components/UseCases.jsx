import { useState } from 'react';
import { Landmark, Megaphone, ShoppingBag, Store, UsersRound } from 'lucide-react';

const useCases = [
  {
    title: 'Sales teams',
    description:
      'Track pipeline quality, quota movement, rep performance, deal risk, and forecast gaps without waiting on a custom report.',
    result: 'Spot stalled revenue earlier and focus weekly reviews on the accounts that matter.',
    icon: UsersRound,
  },
  {
    title: 'Marketing',
    description:
      'Compare campaign spend, channel conversion, lead quality, and cohort behavior from scattered exports and platforms.',
    result: 'Turn campaign performance into next-step decisions while budgets are still flexible.',
    icon: Megaphone,
  },
  {
    title: 'Finance & Operations',
    description:
      'Monitor margin pressure, expense drift, cash movement, inventory patterns, and operational bottlenecks.',
    result: 'Replace manual spreadsheet checks with a live analytical operating rhythm.',
    icon: Landmark,
  },
  {
    title: 'E-commerce',
    description:
      'Understand product velocity, repeat purchase behavior, fulfillment exceptions, and regional demand shifts.',
    result: 'Find profitable segments and unusual demand changes before they affect inventory.',
    icon: ShoppingBag,
  },
  {
    title: 'Small business owners',
    description:
      'Ask direct questions about sales, expenses, customers, and growth without hiring a dedicated analyst.',
    result: 'Make confident decisions from the data you already have.',
    icon: Store,
  },
];

function UseCases() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeUseCase = useCases[activeIndex];
  const ActiveIcon = activeUseCase.icon;

  return (
    <section id="solutions" className="section-blush py-20 sm:py-24 lg:py-32">
      <div className="section-shell">
        <div className="reveal grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end" data-reveal>
          <div>
            <p className="eyebrow mb-4">Solutions</p>
            <h2 className="font-serif text-4xl font-semibold leading-[1.08] text-black sm:text-5xl lg:text-6xl">
              Built for every team.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-taupe lg:ml-auto">
            Deload adapts to the questions each department asks, then turns messy operational data
            into shared context for the whole business.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div
            className="reveal grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
            role="tablist"
            aria-label="Team use cases"
            data-reveal
          >
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              const isActive = index === activeIndex;

              return (
                <button
                  key={useCase.title}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`flex items-center justify-between gap-4 border p-5 text-left transition duration-300 ${
                    isActive
                      ? 'border-black bg-black text-white'
                      : 'border-white bg-white text-black hover:border-blush'
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      size={20}
                      className={isActive ? 'text-blush' : 'text-taupe'}
                      aria-hidden="true"
                    />
                    <span className="font-semibold">{useCase.title}</span>
                  </span>
                  <span className={isActive ? 'text-blush' : 'text-taupe'} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>

          <article className="reveal border border-white bg-white p-7 sm:p-10 lg:p-12" data-reveal>
            <div className="mb-10 inline-flex h-16 w-16 items-center justify-center rounded-full bg-grey-light text-taupe">
              <ActiveIcon size={28} aria-hidden="true" />
            </div>
            <p className="eyebrow mb-4">{activeUseCase.title}</p>
            <h3 className="font-serif text-4xl font-semibold leading-[1.1] text-black sm:text-5xl">
              Ask better questions with the data your team already owns.
            </h3>
            <p className="mt-6 text-lg leading-8 text-taupe">{activeUseCase.description}</p>
            <div className="mt-8 border-l-2 border-blush pl-5">
              <p className="font-serif text-2xl font-semibold leading-snug text-black">
                {activeUseCase.result}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default UseCases;

import {
  Activity,
  Database,
  LayoutDashboard,
  MessageSquareText,
  Timer,
  Workflow,
} from 'lucide-react';

const features = [
  {
    title: 'Chat with your data in plain English',
    description:
      'Ask follow-up questions the way you would ask an analyst, then refine the answer in seconds.',
    icon: MessageSquareText,
  },
  {
    title: 'Auto-generated dashboards',
    description:
      'Move from uploaded tables to polished KPI views, comparison charts, and executive summaries.',
    icon: LayoutDashboard,
  },
  {
    title: 'Trend and anomaly detection',
    description:
      'Surface unusual swings, seasonality, and risk signals before they become end-of-month surprises.',
    icon: Activity,
  },
  {
    title: 'Connect every core source',
    description:
      'Bring CSV, Excel, databases, and business tools together without rebuilding reports manually.',
    icon: Database,
  },
  {
    title: 'Real-time insights in seconds',
    description:
      'Get a fast read on performance while the question is still fresh and decisions are still open.',
    icon: Timer,
  },
  {
    title: 'No-code, no SQL required',
    description:
      'Give non-technical operators the same analytical leverage as a dedicated data team.',
    icon: Workflow,
  },
];

function Features() {
  return (
    <section id="features" className="bg-grey-light py-20 sm:py-24 lg:py-32">
      <div className="section-shell">
        <div className="reveal max-w-3xl" data-reveal>
          <p className="eyebrow mb-4">Features</p>
          <h2 className="font-serif text-4xl font-semibold leading-[1.08] text-black sm:text-5xl lg:text-6xl">
            Everything you need, zero technical skills required.
          </h2>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="reveal border border-white bg-white p-7 transition duration-300 hover:border-blush hover:shadow-subtle sm:p-8"
                data-reveal
              >
                <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-full bg-grey-light text-taupe">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3 className="font-serif text-2xl font-semibold leading-snug text-black">
                  {feature.title}
                </h3>
                <p className="mt-4 leading-7 text-taupe">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;

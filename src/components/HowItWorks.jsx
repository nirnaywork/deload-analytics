import { BarChart3, MessageSquareText, UploadCloud } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Upload your data',
    description: 'Start with CSV, Excel, a database, or connect the tools your team already uses.',
    icon: UploadCloud,
  },
  {
    number: '02',
    title: 'Ask a question',
    description: 'Type a plain-English prompt and let Deload choose the right analysis path.',
    icon: MessageSquareText,
  },
  {
    number: '03',
    title: 'Get instant insight',
    description: 'Receive dashboards, visualizations, trends, anomalies, and recommended actions.',
    icon: BarChart3,
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="section-shell">
        <div className="reveal mx-auto max-w-4xl text-center" data-reveal>
          <p className="eyebrow mb-4">How it works</p>
          <h2 className="font-serif text-4xl font-semibold leading-[1.08] text-black sm:text-5xl lg:text-6xl">
            From raw data to insights in 3 simple steps.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                key={step.title}
                className="reveal relative border border-grey-light bg-white p-7 sm:p-8"
                data-reveal
              >
                {index < steps.length - 1 && (
                  <span className="absolute left-[calc(100%+1.5rem)] top-14 hidden h-px w-[calc(100%-3rem)] bg-grey-light lg:block" />
                )}
                <div className="mb-8 flex items-center justify-between gap-6">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blush font-serif text-2xl font-semibold text-black">
                    {step.number}
                  </span>
                  <Icon size={26} className="text-taupe" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-3xl font-semibold text-black">{step.title}</h3>
                <p className="mt-4 leading-7 text-taupe">{step.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;

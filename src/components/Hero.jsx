import { ArrowRight, BarChart3, MessageSquareText, Sparkles } from 'lucide-react';

function Hero() {
  return (
    <section id="top" className="overflow-hidden bg-white pb-20 pt-16 sm:pt-20 lg:pb-28 lg:pt-28">
      <div className="section-shell grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="reveal max-w-3xl" data-reveal>
          <p className="eyebrow mb-5">Virtual data analyst for growing teams</p>
          <h1 className="font-serif text-5xl font-semibold leading-[1.04] text-black sm:text-6xl lg:text-7xl">
            Turn raw data into insight before the meeting starts.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-taupe sm:text-xl">
            Upload CSVs, spreadsheets, databases, or connected business tools. Ask questions in
            plain English and get instant dashboards, visualizations, trends, and anomalies without
            SQL or Excel.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#signup" className="primary-button">
              Get Started Free
              <ArrowRight className="ml-2" size={18} aria-hidden="true" />
            </a>
            <a href="#how-it-works" className="secondary-button">
              See How It Works
            </a>
          </div>
        </div>

        <div className="reveal" data-reveal>
          <div className="relative mx-auto max-w-xl">
            <div className="absolute -right-5 -top-5 hidden h-28 w-28 rounded-full bg-blush sm:block" />
            <div className="relative border border-grey-light bg-white p-3 shadow-subtle sm:p-5">
              <div className="border border-grey-light bg-white">
                <div className="flex items-center justify-between border-b border-grey-light px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blush" />
                    <span className="h-2.5 w-2.5 rounded-full bg-grey-light" />
                    <span className="h-2.5 w-2.5 rounded-full bg-taupe" />
                  </div>
                  <span className="text-xs font-semibold text-taupe">Q3 revenue analysis</span>
                </div>

                <div className="grid gap-4 p-4 sm:grid-cols-[0.72fr_1fr] sm:p-5">
                  <aside className="soft-panel space-y-3 border border-grey-light p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-black">
                      <MessageSquareText size={17} className="text-taupe" aria-hidden="true" />
                      Ask Deload
                    </div>
                    <div className="bg-white p-3 text-sm leading-6 text-black">
                      Which product lines are slowing down this month?
                    </div>
                    <div className="bg-black p-3 text-sm leading-6 text-white">
                      Revenue is up 14%, but repeat purchase rate dropped in the East region.
                    </div>
                  </aside>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border border-grey-light p-4">
                        <p className="text-xs font-semibold uppercase text-taupe">Revenue</p>
                        <p className="mt-2 font-serif text-3xl font-semibold">$284k</p>
                        <p className="mt-1 text-xs text-taupe">+14% month over month</p>
                      </div>
                      <div className="border border-grey-light p-4">
                        <p className="text-xs font-semibold uppercase text-taupe">Anomalies</p>
                        <p className="mt-2 font-serif text-3xl font-semibold">3</p>
                        <p className="mt-1 text-xs text-taupe">Requires attention</p>
                      </div>
                    </div>

                    <div className="border border-grey-light p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-black">
                          <BarChart3 size={17} className="text-taupe" aria-hidden="true" />
                          Demand trend
                        </div>
                        <Sparkles size={17} className="text-taupe" aria-hidden="true" />
                      </div>
                      <svg
                        className="h-36 w-full"
                        viewBox="0 0 320 148"
                        role="img"
                        aria-label="A rising analytics trend line with monthly bars."
                      >
                        <g fill="none" stroke="#ECECEC" strokeWidth="1">
                          <path d="M0 112H320" />
                          <path d="M0 74H320" />
                          <path d="M0 36H320" />
                        </g>
                        <g fill="#DDC9BD">
                          <rect x="18" y="82" width="24" height="48" />
                          <rect x="64" y="68" width="24" height="62" />
                          <rect x="110" y="52" width="24" height="78" />
                          <rect x="156" y="70" width="24" height="60" />
                          <rect x="202" y="38" width="24" height="92" />
                          <rect x="248" y="24" width="24" height="106" />
                        </g>
                        <path
                          className="mock-line"
                          d="M24 96C58 82 75 68 104 73C139 79 150 40 184 50C221 61 232 30 282 18"
                          fill="none"
                          stroke="#000000"
                          strokeLinecap="round"
                          strokeWidth="3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

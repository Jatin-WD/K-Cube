const TripSection = () => {
  return (
    <section className="mx-auto max-w-[1600px] py-12 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] xl:gap-10">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Win a Trip to Seoul</p>
          <h2 className="mt-4 text-4xl font-semibold text-white md:text-5xl">Win a Trip to Seoul, South Korea</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
            Complete missions, climb leaderboards, and build your Korea score to qualify for our highest rewards and travel incentives.
          </p>

          <div className="mt-8 grid gap-4 xl:grid-cols-3">
            {[
              { label: 'Live chapters', value: '12' },
              { label: 'Trip spots', value: '40' },
              { label: 'Reward boosters', value: '3.5K' },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.75rem] bg-slate-950/90 p-6 shadow-lg shadow-slate-950/20">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{item.label}</p>
                <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { title: 'Live missions', detail: 'Earn Korea XP daily' },
              { title: 'Premium tiers', detail: 'Unlock diamond access' },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.title}</p>
                <p className="mt-4 text-lg font-semibold text-white">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/85 p-8 shadow-2xl shadow-slate-950/30">
            <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-amber-300">Seoul, Korea</div>
              <span className="rounded-full bg-slate-800/90 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">Top prize</span>
            </div>
            <div className="mt-8 space-y-5">
              <div className="rounded-[1.75rem] bg-slate-900/90 p-5 text-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Campaign score</p>
                    <p className="mt-3 text-3xl font-semibold text-white">84.3%</p>
                  </div>
                  <div className="rounded-full bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-amber-300">Live</div>
                </div>
                <div className="mt-6 space-y-3">
                  {['Trips booked', 'Challenges active', 'Leaderboard rank'].map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-3xl bg-slate-950/90 px-4 py-3 text-sm text-slate-300">
                      <span>{item}</span>
                      <span className="text-white">{item === 'Leaderboard rank' ? '#12' : item === 'Trips booked' ? '184' : '27'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-6 text-white">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Progress meter</p>
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-300">54% to Korea</span>
                </div>
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-[54%] rounded-full bg-gradient-to-r from-amber-400 to-cyan-400" />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950/90 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Fastest route</p>
                    <p className="mt-3 text-lg font-semibold text-white">K-CUBE path</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/90 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Goal unlock</p>
                    <p className="mt-3 text-lg font-semibold text-white">Rewards vault</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-slate-900/95 to-slate-950/95 p-8 shadow-2xl shadow-slate-950/40">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Route to Seoul</p>
            <h3 className="mt-4 text-3xl font-semibold text-white">Campaign insights</h3>
            <div className="mt-6 space-y-4">
              {[
                { label: 'Daily mission pace', value: '5.2K' },
                { label: 'Rewards open', value: '87%' },
                { label: 'Chapter completion', value: '72%' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-slate-950/90 p-4">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripSection;

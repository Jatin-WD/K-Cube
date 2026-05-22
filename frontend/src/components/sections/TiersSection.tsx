const tiers = [
  {
    name: 'Bronze',
    subtitle: 'Starter',
    perks: ['Intro missions', 'Daily streaks', 'Basic rewards'],
    accent: 'bg-amber-400/10 text-amber-300',
  },
  {
    name: 'Silver',
    subtitle: 'Explorer',
    perks: ['K-Food unlock', 'Event invites', 'Learning boosts'],
    accent: 'bg-slate-700/10 text-slate-100',
  },
  {
    name: 'Gold',
    subtitle: 'Champion',
    perks: ['VIP camps', 'Map access', 'Flight points'],
    accent: 'bg-amber-300/10 text-amber-300',
  },
  {
    name: 'Diamond',
    subtitle: 'Elite',
    perks: ['Early access', 'Mentor perks', 'Travel priority'],
    accent: 'bg-cyan-500/10 text-cyan-300',
  },
];

const TiersSection = () => {
  return (
    <section className="mx-auto max-w-[1600px] py-12 lg:px-12">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Level Up Your K-Journey</p>
          <h2 className="mt-3 text-4xl font-semibold text-white">Earn badges, unlock tiers, and discover the path from Bronze to Diamond.</h2>
        </div>
        <button className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
          Explore tier perks
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {tiers.map((tier) => (
          <div key={tier.name} className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30">
            <div className={`inline-flex rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${tier.accent}`}>{tier.name}</div>
            <h3 className="mt-6 text-3xl font-semibold text-white">{tier.subtitle}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-400">{tier.name} members unlock stronger boosts, more trip points, and premium community rewards.</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {tier.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-300" />
                  {perk}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              Level {tiers.indexOf(tier) + 1}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TiersSection;

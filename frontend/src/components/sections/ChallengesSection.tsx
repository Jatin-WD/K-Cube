const challengeItems = [
  { title: 'Capture Seoul Quiz', description: 'Win Korean trivia and culture points.', badge: 'Live', color: 'from-cyan-400 to-sky-500' },
  { title: 'K-Food Hunt', description: 'Complete recipe drops and culinary quests.', badge: 'Hot', color: 'from-amber-400 to-orange-500' },
  { title: 'Hangul Sprint', description: 'Fast-track your Korean reading streaks.', badge: 'New', color: 'from-violet-500 to-fuchsia-500' },
  { title: 'Community Clash', description: 'Team up for competitive chapter rewards.', badge: 'Fresh', color: 'from-emerald-400 to-teal-500' },
];

const ChallengesSection = () => {
  return (
    <section className="mx-auto max-w-[1600px] py-12 lg:px-12">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Launch Day Challenges</p>
          <h2 className="mt-3 text-4xl font-semibold text-white">Crush quests, earn badges, and climb the K-CUBE leaderboard.</h2>
        </div>
        <button className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-amber-500/20 transition hover:brightness-110">
          View all challenges
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-4">
        {challengeItems.map((item) => (
          <div key={item.title} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30 transition hover:-translate-y-1 hover:border-amber-300/30">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-200">
              <span className={`inline-flex h-2 w-2 rounded-full bg-gradient-to-r ${item.color}`} />
              {item.badge}
            </div>
            <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-400">{item.description}</p>
            <div className="mt-6 flex items-center justify-between text-sm text-slate-300">
              <span>Start now</span>
              <span className="font-semibold text-white">→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChallengesSection;

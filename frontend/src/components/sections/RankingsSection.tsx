import { ArrowUpRight, Users, BarChart3 } from 'lucide-react';

const RankingsSection = () => {
  return (
    <section className="mx-auto max-w-[1600px] py-12 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Global Rankings</p>
              <h2 className="mt-3 text-4xl font-semibold text-white">Find the top K-CUBE performers and leaderboard champions.</h2>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
              View full board <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-10 rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/20">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Leaderboards</span>
              <span>Monthly ranking</span>
            </div>
            {[
              { rank: 1, name: 'Priya R.', points: '12.4K' },
              { rank: 2, name: 'Aarav S.', points: '11.8K' },
              { rank: 3, name: 'Nisha P.', points: '10.9K' },
              { rank: 4, name: 'Riya K.', points: '10.2K' },
            ].map((user) => (
              <div key={user.rank} className="mt-4 flex items-center justify-between rounded-3xl bg-slate-900/80 px-5 py-4 transition hover:bg-slate-900/90">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-amber-400/10 text-amber-300">#{user.rank}</div>
                  <div>
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-sm text-slate-500">Top competitor</p>
                  </div>
                </div>
                <p className="font-semibold text-white">{user.points}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30">
            <div className="flex items-center gap-3 text-slate-300">
              <Users className="h-4 w-4 text-amber-300" />
              <span className="uppercase tracking-[0.3em] text-xs">Community pulse</span>
            </div>
            <p className="mt-4 text-3xl font-semibold text-white">127K</p>
            <p className="mt-2 text-sm text-slate-400">Active members competing and learning together.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30">
            <div className="flex items-center gap-3 text-slate-300">
              <BarChart3 className="h-4 w-4 text-cyan-300" />
              <span className="uppercase tracking-[0.3em] text-xs">Growth metrics</span>
            </div>
            <p className="mt-4 text-3xl font-semibold text-white">+35%</p>
            <p className="mt-2 text-sm text-slate-400">Weekly engagement growth across missions and courses.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RankingsSection;

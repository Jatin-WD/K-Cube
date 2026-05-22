const communityItems = [
  { title: 'Live community feed', value: 'Trending now' },
  { title: 'Ready to join?', value: 'Full member hub' },
  { title: 'Leader events', value: 'Free training sessions' },
];

const CommunitySection = () => {
  return (
    <section className="mx-auto max-w-[1600px] py-12 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Join the K-Community</p>
          <h2 className="mt-4 text-4xl font-semibold text-white">Connect with members, challenges, and live events across the Korean ecosystem.</h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
            Build networks, join local groups, and compete in community-fueled missions that bring Indian fans closer to Korea.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { label: 'Live feed', value: 'Fresh missions and hot discussions' },
              { label: 'Community rank', value: 'Top chapter activity' },
              { label: 'Social chatter', value: 'Weekly meetups and rewards' },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
                <p className="mt-3 text-lg font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {communityItems.map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/30">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.title}</p>
              <p className="mt-4 text-2xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-slate-900/95 to-slate-950/95 p-8 shadow-2xl shadow-slate-950/30">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Ready to join?</p>
            <p className="mt-3 text-2xl font-semibold text-white">Jump into the K-Community and start earning together.</p>
            <button className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-amber-500/20 transition hover:brightness-110">
              Join community
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;

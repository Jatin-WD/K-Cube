const JoinSection = () => {
  return (
    <section className="mx-auto max-w-[1600px] py-12 lg:px-12">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-slate-950/95 p-10 shadow-2xl shadow-slate-950/40">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Ready to join K-CUBE?</p>
            <h2 className="mt-3 text-4xl font-semibold text-white">Be among the first members to claim exclusive rewards with zero risk.</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
              Sign up today and start collecting stamps, ranking higher, and building your path toward Korea travel rewards.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
            <button className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-amber-500/20 transition hover:brightness-110">
              Create account for free
            </button>
            <button className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Get instant access
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinSection;

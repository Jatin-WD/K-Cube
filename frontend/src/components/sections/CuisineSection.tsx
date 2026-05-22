const CuisineSection = () => {
  return (
    <section className="mx-auto max-w-[1600px] py-12 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Taste Korean Cuisine</p>
          <h2 className="mt-4 text-4xl font-semibold text-white">Discover premium recipes, food drops, and culinary quests.</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
            Experience the best of Korean food with curated meal drops, recipe quests, and culture-focused tasting missions.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { label: 'K-Food Vault', detail: 'Unlock exclusive recipes' },
              { label: 'Flavor quests', detail: 'Track culinary achievements' },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.75rem] bg-slate-950/90 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
                <p className="mt-3 text-lg font-semibold text-white">{item.detail}</p>
              </div>
            ))}
          </div>
          <button className="mt-8 inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-amber-500/20 transition hover:brightness-110">
            Shop K-food items
          </button>
        </div>

        <div className="grid gap-6">
          {[
            { title: 'Seoul Street Menu', subtitle: 'Discover popular street eats and mission-ready dishes.' },
            { title: 'Premium Recipes', subtitle: 'Craft signature Korean meals with step-by-step guidance.' },
            { title: 'Food leaderboards', subtitle: 'Earn rewards for tasting and cooking challenges.' },
          ].map((item) => (
            <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/30">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.title}</p>
              <p className="mt-4 text-lg font-semibold text-white">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CuisineSection;

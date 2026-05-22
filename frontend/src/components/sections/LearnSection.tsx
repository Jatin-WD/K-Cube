const courses = [
  { name: 'Hangul Basics', progress: 76, tag: 'Beginner' },
  { name: 'Travel Phrases', progress: 54, tag: 'Intermediate' },
  { name: 'K-Drama Listening', progress: 42, tag: 'Active' },
  { name: 'Community Stories', progress: 28, tag: 'New' },
];

const LearnSection = () => {
  return (
    <section className="mx-auto max-w-[1600px] py-12 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] xl:gap-10">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Learn Korean like Duolingo</p>
          <h2 className="mt-4 text-4xl font-semibold text-white">Smart lessons, daily streaks, and culture-first learning tools.</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
            Learn Hangul step-by-step while earning rewards, badges, and progress points for every lesson you complete.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {['Daily streaks', 'Mini quizzes', 'Goal rewards'].map((item) => (
              <div key={item} className="rounded-3xl bg-slate-950/90 p-5">
                <p className="text-sm text-slate-400">{item}</p>
                <p className="mt-3 text-2xl font-semibold text-white">+1</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {courses.map((course) => (
            <div key={course.name} className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/30">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{course.tag}</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{course.name}</h3>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">{course.progress}%</span>
              </div>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-cyan-400" style={{ width: `${course.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearnSection;

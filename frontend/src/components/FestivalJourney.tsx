import Link from 'next/link';
import { ArrowRight, CalendarDays, CheckCircle2, MapPin } from 'lucide-react';
import { festivalJourney, festivalStatusLabel, type FestivalStageStatus } from '@/lib/festival2026';

const statusClasses: Record<FestivalStageStatus, string> = {
  completed: 'border-[#12a66a]/25 bg-[#effbf6] text-[#087f52]',
  upcoming: 'border-[var(--kc-blue-700)]/20 bg-[var(--kc-surface-blue)] text-[var(--kc-blue-700)]',
  'main-festival': 'border-[#f59e0b]/30 bg-[#fff8e7] text-[#a16207]',
};

export default function FestivalJourney({ compact = false }: { compact?: boolean }) {
  return (
    <section aria-labelledby="festival-journey-title" className="kc-card p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="kc-eyebrow">Official timeline</p>
          <h2 id="festival-journey-title" className="mt-2 text-xl font-bold text-[var(--kc-text)] sm:text-2xl">
            The 2026 festival journey
          </h2>
        </div>
        <Link href="/india-pre-selection/announcement" className="kc-link w-fit">
          View official updates <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className={`mt-5 grid gap-3 ${compact ? 'md:grid-cols-3' : 'lg:grid-cols-3'}`}>
        {festivalJourney.map((stage, index) => (
          <article key={stage.id} className="relative rounded-lg border border-[var(--kc-border)] bg-[var(--kc-surface-soft)] p-4">
            <div className="flex items-start justify-between gap-3">
              <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-bold ${statusClasses[stage.status]}`}>
                {stage.status === 'completed' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CalendarDays className="h-3.5 w-3.5" />}
                {festivalStatusLabel[stage.status]}
              </span>
              <span className="text-xs font-bold text-[var(--kc-text-muted)]">0{index + 1}</span>
            </div>
            <h3 className="mt-4 text-base font-bold text-[var(--kc-text)]">{stage.title}</h3>
            <p className="mt-2 text-sm font-semibold text-[var(--kc-blue-700)]">{stage.date}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--kc-text-secondary)]">{stage.description}</p>
            {stage.location && (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[var(--kc-text-muted)]">
                <MapPin className="h-3.5 w-3.5" /> {stage.location}
              </p>
            )}
          </article>
        ))}
      </div>
      <p className="mt-4 text-xs text-[var(--kc-text-muted)]">The festival concluded on October 6, 2026. All 2026 stages are archived and applications are closed.</p>
    </section>
  );
}

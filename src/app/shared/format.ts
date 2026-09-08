const DATE_FMT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const MONTH_YEAR_FMT = new Intl.DateTimeFormat('en-GB', {
  month: 'long',
  year: 'numeric',
});

export function formatDate(iso: string | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : DATE_FMT.format(d);
}

/** "September 2024" or "September – October 2024" for a date range. */
export function formatDateRange(start: string, end?: string): string {
  if (!start) return '';
  const s = new Date(start);
  if (Number.isNaN(s.getTime())) return '';
  if (!end) return MONTH_YEAR_FMT.format(s);
  const e = new Date(end);
  if (Number.isNaN(e.getTime())) return MONTH_YEAR_FMT.format(s);
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return MONTH_YEAR_FMT.format(s);
  }
  const sameYear = s.getFullYear() === e.getFullYear();
  const startLabel = sameYear
    ? new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(s)
    : MONTH_YEAR_FMT.format(s);
  return `${startLabel} – ${MONTH_YEAR_FMT.format(e)}`;
}

export function readingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

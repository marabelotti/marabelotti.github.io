export interface PostAttributes {
  kind: 'post';
  title: string;
  slug: string;
  /** ISO date string, e.g. 2026-02-14 */
  date: string;
  description: string;
  tags?: string[];
  draft?: boolean;
}

export interface TripAttributes {
  kind: 'trip';
  title: string;
  slug: string;
  /** ISO date the trip started. */
  date: string;
  /** ISO date the trip ended (optional). */
  dateEnd?: string;
  place: string;
  summary: string;
  /** Filename (no extension) of the cover photo inside the trip's photo folder. */
  cover?: string;
  order?: number;
  draft?: boolean;
  /** Optional per-photo captions, keyed by filename without extension. */
  captions?: Record<string, string>;
}

/**
 * Build-time index of the travel photos.
 *
 * Photos live in `src/content/travels/<trip-slug>/<name>.jpg` and are optimised
 * by `vite-imagetools`: the `?gallery` query (see `vite.config.ts`) turns each
 * one into a responsive WebP `srcset`, and a second pass pulls width/height so
 * the grid can reserve space and avoid layout shift.
 */

export interface TravelPhoto {
  /** Filename without extension — also the caption key. */
  name: string;
  srcset: string;
  src: string;
  width: number;
  height: number;
}

interface ImgMeta {
  src: string;
  width: number;
  height: number;
}

const srcsetModules = import.meta.glob('/src/content/travels/*/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
  query: '?gallery',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const metaModules = import.meta.glob('/src/content/travels/*/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
  query: '?as=metadata&w=1600&format=webp',
  import: 'default',
  eager: true,
}) as Record<string, ImgMeta>;

const byTrip = new Map<string, TravelPhoto[]>();

for (const [path, srcset] of Object.entries(srcsetModules)) {
  const match = path.match(/\/travels\/([^/]+)\/([^/]+)\.[^.]+$/);
  if (!match) continue;
  const [, trip, name] = match;
  const meta = metaModules[path];
  const photo: TravelPhoto = {
    name,
    srcset,
    src: meta?.src ?? '',
    width: meta?.width ?? 1600,
    height: meta?.height ?? 1067,
  };
  const list = byTrip.get(trip) ?? [];
  list.push(photo);
  byTrip.set(trip, list);
}

for (const list of byTrip.values()) {
  list.sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));
}

export function photosForTrip(slug: string): TravelPhoto[] {
  return byTrip.get(slug) ?? [];
}

export function coverPhoto(
  slug: string,
  coverName?: string,
): TravelPhoto | undefined {
  const photos = photosForTrip(slug);
  if (!photos.length) return undefined;
  if (coverName) {
    const found = photos.find((p) => p.name === coverName);
    if (found) return found;
  }
  return photos[0];
}

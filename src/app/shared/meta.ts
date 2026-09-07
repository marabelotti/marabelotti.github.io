import { MetaTag } from '@analogjs/router';

export const SITE_NAME = 'Mara Belotti';
export const SITE_HOST = 'https://marabelotti.github.io';

export interface PageMetaInput {
  title?: string;
  description?: string;
  /** Root-relative path, e.g. `/blog/foo`. */
  path?: string;
  image?: string;
  type?: 'website' | 'article';
}

export function pageTitle(title?: string): string {
  return title && title !== SITE_NAME ? `${title} · ${SITE_NAME}` : SITE_NAME;
}

export function pageMeta(input: PageMetaInput): MetaTag[] {
  const tags: MetaTag[] = [
    { property: 'og:title', content: input.title ?? SITE_NAME },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:type', content: input.type ?? 'website' },
  ];
  if (input.description) {
    tags.push(
      { name: 'description', content: input.description },
      { property: 'og:description', content: input.description },
    );
  }
  if (input.path) {
    tags.push({ property: 'og:url', content: SITE_HOST + input.path });
  }
  if (input.image) {
    tags.push({
      property: 'og:image',
      content: input.image.startsWith('http')
        ? input.image
        : SITE_HOST + input.image,
    });
  }
  return tags;
}

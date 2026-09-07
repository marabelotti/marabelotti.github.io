import { Component, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRouteSnapshot, RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';
import { map } from 'rxjs';
import {
  ContentFile,
  injectContent,
  injectContentFiles,
  MarkdownComponent,
} from '@analogjs/content';
import { TripAttributes } from '../../shared/content-types';
import { formatDateRange } from '../../shared/format';
import {
  coverPhoto,
  photosForTrip,
  TravelPhoto,
} from '../../shared/travel-photos';
import { PhotoGrid } from '../../components/photo-grid';
import { Lightbox } from '../../components/lightbox';
import { pageMeta, pageTitle } from '../../shared/meta';

interface TripVm {
  trip: ContentFile<TripAttributes>;
  photos: TravelPhoto[];
  hasIntro: boolean;
}

function findTrip(route: ActivatedRouteSnapshot) {
  const slug = route.params['trip'];
  return injectContentFiles<TripAttributes>().find(
    (f) =>
      f.attributes.kind === 'trip' &&
      (f.attributes.slug === slug || f.filename.endsWith(`/content/${slug}.md`)),
  );
}

export const routeMeta: RouteMeta = {
  title: (route) => pageTitle(findTrip(route)?.attributes.title),
  meta: (route) => {
    const trip = findTrip(route);
    const slug = trip?.attributes.slug;
    return pageMeta({
      title: trip?.attributes.title,
      description: trip?.attributes.summary,
      path: slug ? `/travels/${slug}` : '/travels',
      type: 'article',
      image: slug ? coverPhoto(slug, trip?.attributes.cover)?.src : undefined,
    });
  },
};

@Component({
  selector: 'app-trip',
  imports: [AsyncPipe, RouterLink, MarkdownComponent, PhotoGrid, Lightbox],
  template: `
    @if (vm$ | async; as vm) {
      <article class="page trip">
        <header class="trip__head">
          <p class="eyebrow"><a routerLink="/travels">Travels</a></p>
          <h1 class="display trip__title">{{ vm.trip.attributes.title }}</h1>
          <p class="trip__meta muted">
            {{ vm.trip.attributes.place }} ·
            {{ range(vm.trip.attributes.date, vm.trip.attributes.dateEnd) }}
          </p>
          @if (vm.hasIntro) {
            <div class="prose trip__intro">
              <analog-markdown [content]="vm.trip.content" />
            </div>
          } @else {
            <p class="prose trip__intro muted">{{ vm.trip.attributes.summary }}</p>
          }
        </header>

        @if (vm.photos.length) {
          <app-photo-grid
            [photos]="vm.photos"
            [captions]="vm.trip.attributes.captions ?? {}"
            (open)="lightboxAt.set($event)"
          />
          <app-lightbox
            [photos]="vm.photos"
            [captions]="vm.trip.attributes.captions ?? {}"
            [openAt]="lightboxAt()"
            (close)="lightboxAt.set(null)"
            (indexChange)="lightboxAt.set($event)"
          />
        } @else {
          <p class="muted">Photos from this trip are still being sorted.</p>
        }
      </article>
    }
  `,
  styles: `
    .trip {
      padding-block: var(--space-xl) 0;
    }

    .trip__head {
      max-width: var(--measure);
      margin-bottom: var(--space-l);
    }

    .trip__title {
      font-size: var(--step-3);
      margin-block: var(--space-2xs) var(--space-3xs);
    }

    .trip__meta {
      font-size: var(--step--1);
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .trip__intro {
      margin-top: var(--space-m);
      font-size: var(--step-1);
    }
  `,
})
export default class TripPage {
  protected readonly range = formatDateRange;

  protected readonly lightboxAt = signal<number | null>(null);

  protected readonly vm$ = injectContent<TripAttributes>('trip').pipe(
    map((trip): TripVm => {
      const slug = trip.attributes.slug;
      const photos = slug ? photosForTrip(slug) : [];
      const content = trip.content;
      return {
        trip: trip as ContentFile<TripAttributes>,
        photos,
        hasIntro: typeof content === 'string' && content.trim().length > 0,
      };
    }),
  );
}

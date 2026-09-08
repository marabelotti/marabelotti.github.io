import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';
import { injectContentFiles } from '@analogjs/content';
import { TripAttributes } from '../../shared/content-types';
import { formatDateRange } from '../../shared/format';
import { coverPhoto } from '../../shared/travel-photos';
import { pageMeta, pageTitle } from '../../shared/meta';

export const routeMeta: RouteMeta = {
  title: pageTitle('Travels'),
  meta: pageMeta({
    title: 'Travels',
    description: 'Photographs from trips, grouped by place and time.',
    path: '/travels',
  }),
};

@Component({
  selector: 'app-travels-index',
  imports: [RouterLink],
  template: `
    <header class="page head">
      <p class="eyebrow">Places, mostly</p>
      <h1 class="display display--outline">Travels</h1>
      <p class="muted lede">
        Photographs from trips
      </p>
    </header>

    <section class="page">
      @if (trips.length) {
        <ul class="grid">
          @for (trip of trips; track trip.slug) {
            <li>
              <a class="trip link-plain" [routerLink]="['/travels', trip.slug]">
                <div class="trip__frame">
                  @if (cover(trip); as c) {
                    <img
                      [srcset]="c.srcset"
                      sizes="(max-width: 700px) 100vw, 33vw"
                      [src]="c.src"
                      [width]="c.width"
                      [height]="c.height"
                      [alt]="trip.title"
                      loading="lazy"
                    />
                  } @else {
                    <div class="trip__placeholder" aria-hidden="true">∴</div>
                  }
                </div>
                <h2 class="trip__title display">{{ trip.title }}</h2>
                <p class="trip__meta muted">
                  {{ trip.place }} · {{ range(trip) }}
                </p>
              </a>
            </li>
          }
        </ul>
      } @else {
        <p class="muted">No trips published yet.</p>
      }
    </section>
  `,
  styles: `
    .head {
      padding-block: var(--space-xl) var(--space-l);
    }

    .head .display {
      font-size: var(--step-4);
      margin-block: var(--space-3xs) var(--space-s);
    }

    .lede {
      max-width: 50ch;
      font-size: var(--step-1);
    }

    .grid {
      list-style: none;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
      gap: var(--space-l) var(--space-m);
    }

    .trip__frame {
      aspect-ratio: 4 / 3;
      overflow: hidden;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-strong);
      background: var(--surface-2);
    }

    .trip__frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .trip:hover .trip__frame img {
      transform: scale(1.03);
    }

    .trip__placeholder {
      display: grid;
      place-items: center;
      height: 100%;
      font-size: 3rem;
      color: var(--accent);
    }

    .trip__title {
      font-size: var(--step-1);
      margin-block: var(--space-2xs) 0.15rem;
    }

    .trip:hover .trip__title {
      color: var(--accent-strong);
    }

    .trip__meta {
      font-size: var(--step--1);
    }
  `,
})
export default class TravelsIndexPage {
  protected readonly cover = (t: TripAttributes) => coverPhoto(t.slug, t.cover);
  protected readonly range = (t: TripAttributes) =>
    formatDateRange(t.date, t.dateEnd);

  protected readonly trips = injectContentFiles<TripAttributes>(
    (file) => file.attributes.kind === 'trip' && !file.attributes.draft,
  )
    .map((f) => f.attributes)
    .sort((a, b) => {
      if (a.order != null && b.order != null) return a.order - b.order;
      return a.date < b.date ? 1 : -1;
    });
}

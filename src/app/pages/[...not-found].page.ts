import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';
import { pageMeta, pageTitle } from '../shared/meta';

export const routeMeta: RouteMeta = {
  title: pageTitle('Not found'),
  meta: pageMeta({ title: 'Not found', path: '/404' }),
};

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="page wrap">
      <p class="eyebrow">404</p>
      <h1 class="display display--outline">Nothing here</h1>
      <p class="muted">
        That page doesn't exist — or doesn't yet. Try the
        <a routerLink="/">home page</a>, the <a routerLink="/blog">blog</a>, or
        <a routerLink="/travels">travels</a>.
      </p>
    </section>
  `,
  styles: `
    .wrap {
      padding-block: var(--space-3xl);
      text-align: center;
    }

    .wrap .display {
      font-size: var(--step-4);
      margin-block: var(--space-3xs) var(--space-s);
    }

    .wrap p.muted {
      max-width: 44ch;
      margin-inline: auto;
    }
  `,
})
export default class NotFoundPage {}

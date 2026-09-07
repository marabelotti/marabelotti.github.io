import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';
import { MathFigures } from '../components/math-figures';
import { ContactLinks } from '../components/contact-links';
import { pageMeta, pageTitle } from '../shared/meta';

export const routeMeta: RouteMeta = {
  title: pageTitle(),
  meta: pageMeta({
    description:
      'Mathematician and software consultant. Writing, travel photographs, and past research.',
    path: '/',
  }),
};

@Component({
  selector: 'app-home',
  imports: [RouterLink, MathFigures, ContactLinks],
  template: `
    <section class="hero">
      <app-math-figures [density]="16" />
      <div class="page hero__inner">
        <p class="eyebrow">Mathematician · Software consultant</p>
        <h1 class="display display--outline hero__title">
          Mara<br />Belotti
        </h1>
        <div class="hero__body prose">
          <!-- TODO(mara): check this bio still reads true. -->
          <p>
            I'm a mathematician working as a software consultant at
            <a href="https://www.tngtech.com" target="_blank" rel="noopener">TNG Technology</a>.
            Before that I did a PhD in mathematics at TU Berlin — discrete and
            algebraic geometry, in
            <a href="https://page.math.tu-berlin.de/~joswig/" target="_blank" rel="noopener">Michael Joswig</a>'s
            group.
          </p>
          <p>
            This site is a slow-growing collection: a few
            <a routerLink="/blog">written thoughts</a>, photographs from
            <a routerLink="/travels">trips</a>, and my earlier
            <a routerLink="/research">research</a>.
          </p>
          <div class="hero__actions">
            <a class="button button--accent" href="/CV.pdf" target="_blank" rel="noopener">
              Curriculum vitae ↗
            </a>
            <a class="button" routerLink="/blog">Read the blog</a>
          </div>
        </div>
      </div>
    </section>

    <section class="page portrait-row">
      <img
        class="portrait"
        src="/portrait.jpg"
        width="360"
        height="360"
        alt="Mara Belotti"
        loading="lazy"
      />
      <div class="portrait-row__aside">
        <h2 class="display">Find me</h2>
        <app-contact-links />
      </div>
    </section>
  `,
  styles: `
    .hero {
      position: relative;
      isolation: isolate;
      padding-block: clamp(var(--space-xl), 12vw, var(--space-3xl));
      border-bottom: 1px solid var(--border);
      overflow: hidden;
    }

    .hero__inner {
      position: relative;
      z-index: 1;
    }

    .hero__title {
      font-size: var(--step-5);
      margin-block: var(--space-xs) var(--space-m);
    }

    .hero__body {
      max-width: 46ch;
      font-size: var(--step-1);
    }

    .hero__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-s);
      margin-top: var(--space-m);
    }

    .portrait-row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: var(--space-xl);
      margin-top: var(--space-2xl);
    }

    .portrait {
      width: min(360px, 70vw);
      height: auto;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-strong);
      box-shadow: var(--shadow-2);
      transform: rotate(-1.5deg);
    }

    .portrait-row__aside h2 {
      font-size: var(--step-2);
      margin-bottom: var(--space-s);
    }
  `,
})
export default class HomePage {}

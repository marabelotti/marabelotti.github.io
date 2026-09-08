import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeader } from './components/site-header';
import { SiteFooter } from './components/site-footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  template: `
    <a class="skip-link" href="#main">Skip to content</a>
    <app-site-header />
    <main id="main" tabindex="-1">
      <router-outlet />
    </main>
    <app-site-footer />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100dvh;
    }

    main {
      flex: 1 0 auto;
      outline: none;
    }

    .skip-link {
      position: absolute;
      left: var(--space-s);
      top: -3rem;
      z-index: 100;
      background: var(--surface);
      border: 1px solid var(--border-strong);
      border-radius: 6px;
      padding: 0.5rem 0.9rem;
      transition: top 0.15s ease;
    }

    .skip-link:focus {
      top: var(--space-s);
    }
  `,
})
export class App {}

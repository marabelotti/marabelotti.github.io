import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  template: `
    <div class="page inner">
      <p class="muted">
        <span class="mark" aria-hidden="true">∴</span>
        Mara Belotti — {{ year }}
      </p>
      <nav aria-label="Footer">
        <a routerLink="/blog">Blog</a>
        <a routerLink="/travels">Travels</a>
        <a routerLink="/research">Research</a>
        <a href="https://github.com/marabelotti" target="_blank" rel="noopener">GitHub</a>
      </nav>
    </div>
  `,
  styles: `
    :host {
      display: block;
      border-top: 1px solid var(--border);
      margin-top: var(--space-3xl);
      padding-block: var(--space-l);
      font-size: var(--step--1);
    }

    .inner {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-s) var(--space-l);
      align-items: center;
      justify-content: space-between;
    }

    .mark {
      color: var(--accent);
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-m);
    }

    nav a {
      color: var(--ink-muted);
      letter-spacing: 0.06em;
      text-transform: uppercase;
      font-weight: 700;
    }

    nav a:hover {
      color: var(--ink);
      text-decoration: none;
    }
  `,
})
export class SiteFooter {
  protected readonly year = new Date().getFullYear();
}

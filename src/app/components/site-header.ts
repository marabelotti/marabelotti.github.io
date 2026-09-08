import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggle } from './theme-toggle';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, ThemeToggle],
  template: `
    <div class="bar page">
      <a routerLink="/" class="brand link-plain" (click)="close()">
        <span class="brand__mark" aria-hidden="true">∴</span>
        <span class="brand__name">Mara Belotti</span>
      </a>

      <button
        type="button"
        class="menu-btn"
        [attr.aria-expanded]="open()"
        aria-controls="site-nav"
        (click)="toggle()"
      >
        <span class="visually-hidden">Menu</span>
        <span class="menu-btn__glyph" aria-hidden="true">{{ open() ? '×' : '≡' }}</span>
      </button>

      <nav id="site-nav" class="nav" [class.nav--open]="open()" aria-label="Primary">
        <ul>
          @for (item of items; track item.path) {
            <li>
              <a
                [routerLink]="item.path"
                routerLinkActive="is-active"
                [routerLinkActiveOptions]="{ exact: item.path === '/' }"
                (click)="close()"
              >
                {{ item.label }}
              </a>
            </li>
          }
          <li>
            <a href="/CV.pdf" target="_blank" rel="noopener">CV ↗</a>
          </li>
        </ul>
        <app-theme-toggle />
      </nav>
    </div>
  `,
  styles: `
    :host {
      position: sticky;
      top: 0;
      z-index: 40;
      background: color-mix(in srgb, var(--bg) 88%, transparent);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
    }

    .bar {
      display: flex;
      align-items: center;
      gap: var(--space-m);
      padding-block: 0.75rem;
    }

    .brand {
      display: inline-flex;
      align-items: baseline;
      gap: 0.5rem;
      margin-right: auto;
      font-family: var(--font-display);
      font-size: var(--step-1);
      font-variation-settings: 'opsz' 90, 'SOFT' 40, 'WONK' 1, 'wght' 460;
    }

    .brand__mark {
      color: var(--accent);
      font-size: 1.1em;
    }

    .nav {
      display: flex;
      align-items: center;
      gap: var(--space-m);
    }

    .nav ul {
      display: flex;
      align-items: center;
      gap: clamp(0.9rem, 2vw, 1.6rem);
      list-style: none;
      padding: 0;
    }

    .nav a {
      color: var(--ink-muted);
      font-size: var(--step--1);
      letter-spacing: 0.06em;
      text-transform: uppercase;
      font-weight: 700;
      padding-block: 0.3rem;
    }

    .nav a:hover {
      color: var(--ink);
      text-decoration: none;
    }

    .nav a.is-active {
      color: var(--ink);
      box-shadow: inset 0 -2px 0 var(--accent);
    }

    .menu-btn {
      display: none;
      width: 2.4rem;
      height: 2.4rem;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border-strong);
      border-radius: 999px;
      background: var(--surface);
      color: var(--ink);
      cursor: pointer;
    }

    .menu-btn__glyph {
      font-size: 1.3rem;
      line-height: 1;
    }

    @media (max-width: 780px) {
      .menu-btn {
        display: inline-flex;
      }

      .nav {
        position: absolute;
        inset: 100% 0 auto 0;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-s);
        padding: var(--space-m);
        background: var(--bg);
        border-bottom: 1px solid var(--border);
        box-shadow: var(--shadow-2);
        display: none;
      }

      .nav--open {
        display: flex;
      }

      .nav ul {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-s);
      }
    }
  `,
})
export class SiteHeader {
  protected readonly open = signal(false);

  protected readonly items = [
    { path: '/', label: 'Home' },
    { path: '/blog', label: 'Blog' },
    { path: '/travels', label: 'Travels' },
    { path: '/research', label: 'Research' },
  ];

  protected toggle(): void {
    this.open.update((v) => !v);
  }

  protected close(): void {
    this.open.set(false);
  }
}

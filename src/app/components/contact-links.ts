import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contact-links',
  template: `
    <ul class="list" [class.list--inline]="inline">
      <li>
        <a href="mailto:marabelotti96@gmail.com">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span>marabelotti96&#64;gmail.com</span>
        </a>
      </li>
      <li>
        <a href="https://de.linkedin.com/in/mara-belotti-2275171a9" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
          </svg>
          <span>LinkedIn</span>
        </a>
      </li>
      <li>
        <a
          href="https://arxiv.org/a/belotti_m_1"
          target="_blank"
          rel="noopener"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 18h8M3 22h18M14 22a7 7 0 1 0 0-14h-1M9 14h2M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2ZM12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
          </svg>
          <span>arXiv</span>
        </a>
      </li>
      <li>
        <a href="https://github.com/marabelotti" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
            />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          <span>GitHub</span>
        </a>
      </li>
    </ul>
  `,
  styles: `
    .list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .list--inline {
      flex-direction: row;
      flex-wrap: wrap;
      gap: var(--space-s) var(--space-m);
    }

    a {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      color: var(--ink-muted);
      font-size: var(--step--1);
    }

    a:hover {
      color: var(--accent-strong);
      text-decoration: none;
    }

    svg {
      width: 1.15rem;
      height: 1.15rem;
      flex: none;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.7;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `,
})
export class ContactLinks {
  @Input() inline = false;
}

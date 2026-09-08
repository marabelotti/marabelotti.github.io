import {
  Component,
  DOCUMENT,
  Inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type ThemeChoice = 'light' | 'dark' | 'system';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button
      type="button"
      class="toggle"
      [attr.aria-label]="label()"
      [attr.title]="label()"
      (click)="cycle()"
    >
      @switch (choice()) {
        @case ('light') {
          <!-- sun -->
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path
              d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
            />
          </svg>
        }
        @case ('dark') {
          <!-- moon -->
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </svg>
        }
        @default {
          <!-- system -->
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="4" width="18" height="13" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
        }
      }
    </button>
  `,
  styles: `
    .toggle {
      display: inline-grid;
      place-items: center;
      width: 2.4rem;
      height: 2.4rem;
      border-radius: 999px;
      border: 1px solid var(--border-strong);
      background: var(--surface);
      color: var(--ink);
      cursor: pointer;
      transition: background-color 0.15s ease, transform 0.15s ease;
    }

    .toggle:hover {
      background: var(--surface-2);
      transform: translateY(-1px);
    }

    svg {
      width: 1.15rem;
      height: 1.15rem;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `,
})
export class ThemeToggle {
  private readonly isBrowser: boolean;
  protected readonly choice = signal<ThemeChoice>('system');

  constructor(
    @Inject(DOCUMENT) private readonly doc: Document,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const stored = this.readStored();
      this.choice.set(stored);
    }
  }

  protected label(): string {
    return `Theme: ${this.choice()} (click to change)`;
  }

  protected cycle(): void {
    const order: ThemeChoice[] = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(this.choice()) + 1) % order.length];
    this.choice.set(next);
    this.apply(next);
  }

  private apply(choice: ThemeChoice): void {
    if (!this.isBrowser) return;
    const root = this.doc.documentElement;
    try {
      if (choice === 'system') {
        delete root.dataset['theme'];
        localStorage.removeItem('theme');
      } else {
        root.dataset['theme'] = choice;
        localStorage.setItem('theme', choice);
      }
    } catch {
      root.dataset['theme'] = choice === 'system' ? '' : choice;
    }
  }

  private readStored(): ThemeChoice {
    try {
      const t = localStorage.getItem('theme');
      return t === 'light' || t === 'dark' ? t : 'system';
    } catch {
      return 'system';
    }
  }
}

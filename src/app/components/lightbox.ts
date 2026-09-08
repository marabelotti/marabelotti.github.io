import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  effect,
  input,
} from '@angular/core';
import { TravelPhoto } from '../shared/travel-photos';

@Component({
  selector: 'app-lightbox',
  template: `
    @if (openAt() !== null) {
      <div
        class="backdrop"
        role="dialog"
        aria-modal="true"
        aria-label="Photograph viewer"
        (click)="onBackdrop($event)"
      >
        <button #closeBtn type="button" class="ctl ctl--close" (click)="close.emit()">
          <span class="visually-hidden">Close</span>
          <span aria-hidden="true">×</span>
        </button>

        @if (photos.length > 1) {
          <button type="button" class="ctl ctl--prev" (click)="step(-1)">
            <span class="visually-hidden">Previous</span>
            <span aria-hidden="true">‹</span>
          </button>
          <button type="button" class="ctl ctl--next" (click)="step(1)">
            <span class="visually-hidden">Next</span>
            <span aria-hidden="true">›</span>
          </button>
        }

        @if (current(); as photo) {
          <figure class="stage" (click)="$event.stopPropagation()">
            <img
              [srcset]="photo.srcset"
              sizes="96vw"
              [src]="photo.src"
              [alt]="caption(photo) || 'Photograph'"
            />
            <figcaption>
              <span>{{ caption(photo) }}</span>
              <span class="count">{{ (openAt() ?? 0) + 1 }} / {{ photos.length }}</span>
            </figcaption>
          </figure>
        }
      </div>
    }
  `,
  styles: `
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 90;
      display: grid;
      place-items: center;
      padding: clamp(0.5rem, 3vw, 2.5rem);
      background: color-mix(in srgb, #0b0810 92%, transparent);
      backdrop-filter: blur(4px);
    }

    .stage {
      max-width: 96vw;
      max-height: 92dvh;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .stage img {
      max-width: 100%;
      max-height: 84dvh;
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: 4px;
      box-shadow: 0 20px 60px -20px rgba(0, 0, 0, 0.8);
    }

    figcaption {
      display: flex;
      justify-content: space-between;
      gap: var(--space-m);
      color: rgba(255, 255, 255, 0.82);
      font-size: var(--step--1);
    }

    .count {
      white-space: nowrap;
      opacity: 0.7;
    }

    .ctl {
      position: absolute;
      display: grid;
      place-items: center;
      width: 3rem;
      height: 3rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.25);
      background: rgba(0, 0, 0, 0.35);
      color: #fff;
      font-size: 1.6rem;
      line-height: 1;
      cursor: pointer;
    }

    .ctl:hover {
      background: rgba(0, 0, 0, 0.6);
    }

    .ctl--close {
      top: 1rem;
      right: 1rem;
      font-size: 1.9rem;
    }

    .ctl--prev {
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
    }

    .ctl--next {
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
    }
  `,
})
export class Lightbox {
  @Input({ required: true }) photos: TravelPhoto[] = [];
  @Input() captions: Record<string, string> = {};

  /** Index of the open photo, or null when closed. */
  readonly openAt = input<number | null>(null);

  @Output() close = new EventEmitter<void>();
  @Output() indexChange = new EventEmitter<number>();

  @ViewChild('closeBtn') private closeBtn?: ElementRef<HTMLButtonElement>;

  constructor() {
    effect(() => {
      const at = this.openAt();
      if (typeof document === 'undefined') return;
      document.body.style.overflow = at === null ? '' : 'hidden';
      if (at !== null) {
        queueMicrotask(() => this.closeBtn?.nativeElement.focus());
      }
    });
  }

  protected current(): TravelPhoto | undefined {
    const at = this.openAt();
    return at === null ? undefined : this.photos[at];
  }

  protected caption(photo: TravelPhoto): string | undefined {
    return this.captions?.[photo.name];
  }

  protected onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close.emit();
  }

  protected step(delta: number): void {
    const at = this.openAt();
    if (at === null) return;
    const n = this.photos.length;
    this.indexChange.emit((at + delta + n) % n);
  }

  @HostListener('document:keydown', ['$event'])
  protected onKey(event: KeyboardEvent): void {
    if (this.openAt() === null) return;
    if (event.key === 'Escape') this.close.emit();
    else if (event.key === 'ArrowLeft') this.step(-1);
    else if (event.key === 'ArrowRight') this.step(1);
  }
}

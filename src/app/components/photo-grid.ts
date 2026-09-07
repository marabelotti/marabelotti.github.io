import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TravelPhoto } from '../shared/travel-photos';

@Component({
  selector: 'app-photo-grid',
  template: `
    <div class="masonry">
      @for (photo of photos; track photo.name; let i = $index) {
        <button
          type="button"
          class="cell"
          [style.aspect-ratio]="photo.width + ' / ' + photo.height"
          (click)="open.emit(i)"
        >
          <img
            [srcset]="photo.srcset"
            sizes="(max-width: 700px) 92vw, (max-width: 1100px) 45vw, 30vw"
            [src]="photo.src"
            [width]="photo.width"
            [height]="photo.height"
            [alt]="caption(photo) || 'Photograph'"
            loading="lazy"
            decoding="async"
          />
          @if (caption(photo); as cap) {
            <span class="cell__cap">{{ cap }}</span>
          }
        </button>
      }
    </div>
  `,
  styles: `
    .masonry {
      columns: 3 18rem;
      column-gap: var(--space-s);
    }

    @media (max-width: 700px) {
      .masonry {
        columns: 1;
      }
    }

    .cell {
      display: block;
      width: 100%;
      margin: 0 0 var(--space-s);
      padding: 0;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      background: var(--surface-2);
      cursor: zoom-in;
      break-inside: avoid;
      position: relative;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .cell:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-2);
    }

    .cell img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .cell__cap {
      position: absolute;
      inset: auto 0 0 0;
      padding: 0.6rem 0.7rem 0.5rem;
      font-size: var(--step--1);
      color: #fff;
      text-align: left;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .cell:hover .cell__cap,
    .cell:focus-visible .cell__cap {
      opacity: 1;
    }
  `,
})
export class PhotoGrid {
  @Input({ required: true }) photos: TravelPhoto[] = [];
  @Input() captions: Record<string, string> = {};
  @Output() open = new EventEmitter<number>();

  protected caption(photo: TravelPhoto): string | undefined {
    return this.captions?.[photo.name];
  }
}

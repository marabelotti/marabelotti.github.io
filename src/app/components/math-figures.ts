import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Figure {
  img: HTMLImageElement;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
}

const FIGURE_SRCS = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/figures/${n}.png`);

/**
 * The site's signature: math figures (TikZ drawings) drifting slowly behind the
 * content, rendered in grayscale. A modern take on the original hand-written
 * `<canvas>` animation — DPR-aware, wraps instead of hard-bouncing, pauses when
 * off-screen or the tab is hidden, and freezes to a single static frame when the
 * visitor prefers reduced motion.
 */
@Component({
  selector: 'app-math-figures',
  template: `<canvas #canvas aria-hidden="true"></canvas>`,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
    }

    canvas {
      width: 100%;
      height: 100%;
      filter: var(--figures-filter, grayscale(1) contrast(1.05));
      opacity: var(--figures-opacity, 0.4);
      mix-blend-mode: var(--figures-blend, normal);
    }
  `,
})
export class MathFigures implements AfterViewInit, OnDestroy {
  /** Roughly how many figures to float. Scaled down on small screens. */
  @Input() density = 14;

  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly isBrowser: boolean;
  private ctx: CanvasRenderingContext2D | null = null;
  private figures: Figure[] = [];
  private rafId = 0;
  private running = false;
  private width = 0;
  private height = 0;
  private dpr = 1;
  private reducedMotion = false;

  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;
  private onVisibility = () => this.syncRunning(this.onScreen);
  private onScreen = true;

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly zone: NgZone,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;

    this.reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    this.measure();

    Promise.all(FIGURE_SRCS.map((src) => this.loadImage(src)))
      .then((imgs) => imgs.filter((i): i is HTMLImageElement => !!i))
      .then((imgs) => {
        if (!imgs.length) return;
        this.seed(imgs);
        this.draw();
        if (!this.reducedMotion) {
          this.observe();
          this.syncRunning(true);
        }
      });
  }

  ngOnDestroy(): void {
    this.stop();
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    if (this.isBrowser) {
      document.removeEventListener('visibilitychange', this.onVisibility);
    }
  }

  private observe(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.measure();
      if (!this.running) this.draw();
    });
    this.resizeObserver.observe(this.host.nativeElement);

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        this.onScreen = entries.some((e) => e.isIntersecting);
        this.syncRunning(this.onScreen);
      },
      { rootMargin: '120px' },
    );
    this.intersectionObserver.observe(this.host.nativeElement);

    document.addEventListener('visibilitychange', this.onVisibility);
  }

  private syncRunning(shouldRun: boolean): void {
    const run = shouldRun && !document.hidden && !this.reducedMotion;
    if (run && !this.running) {
      this.running = true;
      this.zone.runOutsideAngular(() => {
        this.rafId = requestAnimationFrame(this.tick);
      });
    } else if (!run && this.running) {
      this.stop();
    }
  }

  private stop(): void {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  private measure(): void {
    const rect = this.host.nativeElement.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);

    const canvas = this.canvasRef.nativeElement;
    canvas.width = Math.round(this.width * this.dpr);
    canvas.height = Math.round(this.height * this.dpr);
    this.ctx?.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private seed(imgs: HTMLImageElement[]): void {
    const count = Math.max(
      5,
      Math.round(this.density * Math.min(1, this.width / 1100)),
    );
    const rnd = mulberry32(0x5eed ^ Math.round(this.width));

    this.figures = Array.from({ length: count }, () => {
      const img = imgs[Math.floor(rnd() * imgs.length)];
      const size = 70 + rnd() * 150;
      return {
        img,
        x: rnd() * this.width,
        y: rnd() * this.height,
        size,
        vx: (rnd() - 0.5) * 0.22,
        vy: (rnd() - 0.5) * 0.22,
        rot: rnd() * Math.PI * 2,
        vrot: (rnd() - 0.5) * 0.0016,
      };
    });
  }

  private tick = (): void => {
    this.step();
    this.draw();
    if (this.running) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  };

  private step(): void {
    const margin = 260;
    for (const f of this.figures) {
      f.x += f.vx;
      f.y += f.vy;
      f.rot += f.vrot;

      if (f.x < -margin) f.x = this.width + margin;
      if (f.x > this.width + margin) f.x = -margin;
      if (f.y < -margin) f.y = this.height + margin;
      if (f.y > this.height + margin) f.y = -margin;
    }
  }

  private draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);
    for (const f of this.figures) {
      const ratio = f.img.naturalHeight / f.img.naturalWidth || 1;
      const w = f.size;
      const h = f.size * ratio;
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rot);
      ctx.globalAlpha = 0.9;
      ctx.drawImage(f.img, -w / 2, -h / 2, w, h);
      ctx.restore();
    }
  }

  private loadImage(src: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }
}

/** Small seeded PRNG so the scatter is stable within a given viewport size. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

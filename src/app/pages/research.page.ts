import { Component } from '@angular/core';
import { RouteMeta } from '@analogjs/router';
import { pageMeta, pageTitle } from '../shared/meta';

export const routeMeta: RouteMeta = {
  title: pageTitle('Mathematics'),
  meta: pageMeta({
    title: 'Mathematics',
    description:
      'Past research in discrete and algebraic geometry: publications from a PhD at TU Berlin.',
    path: '/research',
  }),
};

interface Publication {
  title: string;
  href: string;
  authors: string;
  venue: string;
}

@Component({
  selector: 'app-research',
  template: `
    <header class="page head">
      <p class="eyebrow">Before the code</p>
      <h1 class="display display--outline">Mathematics</h1>
      <p class="muted lede">
        A PhD at TU Berlin in discrete and algebraic geometry, and the master's
        work before it. Papers, and a few pictures I'm still fond of.
      </p>
    </header>

    <section class="page">
      <h2 class="display section-title">Publications</h2>
      <ol class="pubs">
        @for (p of publications; track p.title) {
          <li>
            <a [href]="p.href" target="_blank" rel="noopener">{{ p.title }}</a>
            <span class="pubs__meta">
              with {{ p.authors }} · <i>{{ p.venue }}</i>
            </span>
          </li>
        }
      </ol>
    </section>

    <section class="page">
      <h2 class="display section-title">Pictures I'm fond of</h2>
      <div class="cards">
        <article class="card tint-amber">
          <h3>Geometric graphs</h3>
          <img src="/figures/8.png" alt="A geometric graph" loading="lazy" />
          <p>The subject of my master's thesis.</p>
          <a
            class="button"
            href="https://media.mis.mpg.de/naso2020/2020-12-01_2/"
            target="_blank"
            rel="noopener"
          >
            Talk by Antonio ↗
          </a>
        </article>

        <article class="card tint-green">
          <h3>Constrained realization spaces</h3>
          <img
            src="/figures/3.png"
            alt="A constrained realization space"
            loading="lazy"
          />
          <p>If you love nice pictures, look this one up.</p>
          <a
            class="button"
            href="https://github.com/marabelotti/KoebeRealizations.jl"
            target="_blank"
            rel="noopener"
          >
            Code on GitHub ↗
          </a>
        </article>

        <article class="card tint-red">
          <h3>Counting cubic hypersurfaces</h3>
          <img
            src="/figures/1.png"
            alt="Counting cubic hypersurfaces"
            loading="lazy"
          />
          <p>
            There are 213&nbsp;642&nbsp;327&nbsp;616 cubic surfaces tangent to 19
            generic given lines.
          </p>
          <a
            class="button"
            href="https://mathrepo.mis.mpg.de/CountingCubicHypersurfaces/index.html"
            target="_blank"
            rel="noopener"
          >
            See more ↗
          </a>
        </article>
      </div>
    </section>
  `,
  styles: `
    .head {
      padding-block: var(--space-xl) var(--space-l);
    }

    .head .display {
      font-size: var(--step-4);
      margin-block: var(--space-3xs) var(--space-s);
    }

    .lede {
      max-width: 52ch;
      font-size: var(--step-1);
    }

    .section-title {
      font-size: var(--step-2);
      margin-bottom: var(--space-m);
    }

    section + section {
      margin-top: var(--space-2xl);
    }

    .pubs {
      display: flex;
      flex-direction: column;
      gap: var(--space-m);
      max-width: var(--measure);
      padding-left: 1.4ch;
    }

    .pubs li {
      padding-left: 0.4ch;
    }

    .pubs a {
      text-decoration: underline;
      text-underline-offset: 0.2em;
    }

    .pubs__meta {
      display: block;
      color: var(--ink-muted);
      font-size: var(--step--1);
      margin-top: 0.2rem;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
      gap: var(--space-m);
    }

    .card {
      display: flex;
      flex-direction: column;
      gap: var(--space-s);
      text-align: center;
    }

    .card h3 {
      font-size: var(--step-1);
    }

    .card img {
      align-self: center;
      max-height: 190px;
      width: auto;
      mix-blend-mode: multiply;
    }

    :root[data-theme='dark'] .card img,
    :where(:root:not([data-theme='light'])) .card img {
      mix-blend-mode: normal;
    }

    .card .button {
      align-self: center;
      margin-top: auto;
    }
  `,
})
export default class ResearchPage {
  protected readonly publications: Publication[] = [
    {
      title:
        'Algebraic and Geometric Computations in OSCAR',
      href: 'https://sinews.siam.org/Details-Page/algebraic-and-geometric-computations-in-oscar',
      authors: 'Joswig M., Meroni C., Schleis V. and Schmitt J.',
      venue: 'SIAM News (2023)',
    },
    {
      title: 'Discrete geometry of Cox rings of blow-ups of P³',
      href: 'https://arxiv.org/abs/2208.05258',
      authors: 'Panizzut M.',
      venue: 'Submitted',
    },
    {
      title:
        'The enumerative geometry of cubic hypersurfaces: point and line conditions',
      href: 'https://link.springer.com/article/10.1007/s13348-023-00401-z',
      authors: 'Danelon A., Fevola C. and Kretschmer A.',
      venue: 'Collectanea Mathematica (2023)',
    },
    {
      title: 'Algebraic Degrees of 3-Dimensional Polytopes',
      href: 'https://link.springer.com/article/10.1007/s10013-022-00559-2',
      authors: 'Joswig M. and Panizzut M.',
      venue:
        'Vietnam Journal of Mathematics (special issue for Sturmfels’ 60th birthday, 2022)',
    },
    {
      title: 'Moduli spaces of geometric graphs',
      href: 'https://arxiv.org/abs/2107.11338',
      authors: 'Lerario A. and Newman A.',
      venue: 'Algebraic & Geometric Topology (2023)',
    },
    {
      title: 'Real lines on random cubic surfaces',
      href: 'https://arxiv.org/abs/1910.07326',
      authors: 'Meroni C. and Ait El Manssour R.',
      venue: 'Arnold Mathematical Journal (2021)',
    },
  ];
}

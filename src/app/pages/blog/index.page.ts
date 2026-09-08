import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';
import { injectContentFiles } from '@analogjs/content';
import { PostAttributes } from '../../shared/content-types';
import { formatDate } from '../../shared/format';
import { pageMeta, pageTitle } from '../../shared/meta';

export const routeMeta: RouteMeta = {
  title: pageTitle('Blog'),
  meta: pageMeta({
    title: 'Blog',
    description: 'Occasional notes about mathematics, software, and life.',
    path: '/blog',
  }),
};

@Component({
  selector: 'app-blog-index',
  imports: [RouterLink],
  template: `
    <header class="page head">
      <p class="eyebrow">Thoughts, unsorted</p>
      <h1 class="display display--outline">Blog</h1>
      <p class="muted lede">
        Occasional notes — about whatever has
        been on my mind.
      </p>
    </header>

    <section class="page">
      @if (posts.length) {
        <ul class="posts">
          @for (post of posts; track post.attributes.slug) {
            <li>
              <a class="post link-plain" [routerLink]="['/blog', post.attributes.slug]">
                <time class="post__date" [attr.datetime]="post.attributes.date">
                  {{ formatDate(post.attributes.date) }}
                </time>
                <h2 class="post__title display">{{ post.attributes.title }}</h2>
                <p class="post__desc muted">{{ post.attributes.description }}</p>
              </a>
            </li>
          }
        </ul>
      } @else {
        <p class="muted">Nothing here yet. Soon.</p>
      }
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
      max-width: 48ch;
      font-size: var(--step-1);
    }

    .posts {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .posts li + li {
      border-top: 1px solid var(--border);
    }

    .post {
      display: block;
      padding-block: var(--space-m);
    }

    .post:hover .post__title {
      color: var(--accent-strong);
    }

    .post__date {
      font-size: var(--step--1);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink-faint);
    }

    .post__title {
      font-size: var(--step-2);
      margin-block: 0.2rem 0.3rem;
    }

    .post__desc {
      max-width: var(--measure);
    }
  `,
})
export default class BlogIndexPage {
  protected readonly formatDate = formatDate;

  protected readonly posts = injectContentFiles<PostAttributes>(
    (file) => file.attributes.kind === 'post' && !file.attributes.draft,
  ).sort((a, b) => (a.attributes.date < b.attributes.date ? 1 : -1));
}

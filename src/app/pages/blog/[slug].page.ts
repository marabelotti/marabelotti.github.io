import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRouteSnapshot, RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';
import { map } from 'rxjs';
import {
  ContentFile,
  injectContent,
  injectContentFiles,
  MarkdownComponent,
} from '@analogjs/content';
import { PostAttributes } from '../../shared/content-types';
import { formatDate, readingTime } from '../../shared/format';
import { pageMeta, pageTitle } from '../../shared/meta';

function findPost(route: ActivatedRouteSnapshot) {
  const slug = route.params['slug'];
  return injectContentFiles<PostAttributes>().find(
    (f) =>
      f.attributes.kind === 'post' &&
      (f.attributes.slug === slug || f.filename.endsWith(`/content/${slug}.md`)),
  );
}

export const routeMeta: RouteMeta = {
  title: (route) => pageTitle(findPost(route)?.attributes.title),
  meta: (route) => {
    const post = findPost(route);
    return pageMeta({
      title: post?.attributes.title,
      description: post?.attributes.description,
      path: post ? `/blog/${post.attributes.slug}` : '/blog',
      type: 'article',
    });
  },
};

@Component({
  selector: 'app-blog-post',
  imports: [AsyncPipe, RouterLink, MarkdownComponent],
  template: `
    @if (vm$ | async; as vm) {
      <article class="page post">
        <header class="post__head">
          <p class="eyebrow"><a routerLink="/blog">Blog</a></p>
          <h1 class="display post__title">{{ vm.post.attributes.title }}</h1>
          <p class="post__meta muted">
            <time [attr.datetime]="vm.post.attributes.date">
              {{ formatDate(vm.post.attributes.date) }}
            </time>
            · {{ vm.minutes }} min read
          </p>
          @if (vm.post.attributes.tags?.length) {
            <ul class="tags">
              @for (tag of vm.post.attributes.tags; track tag) {
                <li>#{{ tag }}</li>
              }
            </ul>
          }
        </header>

        <div class="prose post__body">
          <analog-markdown [content]="vm.post.content" />
        </div>

        <nav class="post__nav">
          @if (vm.prev; as p) {
            <a class="post__nav-link" [routerLink]="['/blog', p.attributes.slug]">
              <span class="muted">← Earlier</span>
              <span>{{ p.attributes.title }}</span>
            </a>
          } @else {
            <span></span>
          }
          @if (vm.next; as n) {
            <a
              class="post__nav-link post__nav-link--next"
              [routerLink]="['/blog', n.attributes.slug]"
            >
              <span class="muted">Later →</span>
              <span>{{ n.attributes.title }}</span>
            </a>
          }
        </nav>
      </article>
    }
  `,
  styles: `
    .post {
      padding-block: var(--space-xl) 0;
    }

    .post__head {
      max-width: var(--measure);
      margin-bottom: var(--space-l);
    }

    .post__title {
      font-size: var(--step-3);
      margin-block: var(--space-2xs) var(--space-xs);
    }

    .post__meta {
      font-size: var(--step--1);
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      list-style: none;
      padding: 0;
      margin-top: var(--space-xs);
      font-size: var(--step--1);
      color: var(--ink-faint);
    }

    .post__body {
      font-size: var(--step-1);
    }

    .post__nav {
      display: flex;
      justify-content: space-between;
      gap: var(--space-m);
      margin-top: var(--space-2xl);
      padding-top: var(--space-m);
      border-top: 1px solid var(--border);
    }

    .post__nav-link {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      max-width: 22ch;
      color: var(--ink);
    }

    .post__nav-link--next {
      text-align: right;
      margin-left: auto;
    }

    .post__nav-link span:last-child {
      font-family: var(--font-display);
    }

    .post__nav-link:hover span:last-child {
      color: var(--accent-strong);
    }
  `,
})
export default class BlogPostPage {
  protected readonly formatDate = formatDate;

  private readonly allPosts = injectContentFiles<PostAttributes>(
    (file) => file.attributes.kind === 'post' && !file.attributes.draft,
  ).sort((a, b) => (a.attributes.date < b.attributes.date ? 1 : -1));

  protected readonly vm$ = injectContent<PostAttributes>('slug').pipe(
    map((post) => {
      const i = this.allPosts.findIndex(
        (p) => p.attributes.slug === post.attributes.slug,
      );
      const content = post.content;
      return {
        post,
        minutes: typeof content === 'string' ? readingTime(content) : 1,
        prev: i >= 0 ? this.allPosts[i + 1] : undefined,
        next: i > 0 ? this.allPosts[i - 1] : undefined,
      } as {
        post: ContentFile<PostAttributes>;
        minutes: number;
        prev?: ContentFile<PostAttributes>;
        next?: ContentFile<PostAttributes>;
      };
    }),
  );
}

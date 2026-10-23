import { Component, computed, input } from '@angular/core';

// Инициалы вместо фото: в admin DTO пользователей нет аватаров.
@Component({
  selector: 'app-avatar',
  template: `<span class="avatar" [class.small]="size() === 'small'" aria-hidden="true">{{ initials() }}</span>`,
  styles: `
    .avatar {
      flex: none;
      display: inline-grid;
      place-items: center;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      background: var(--p-highlight-background);
      color: var(--p-highlight-color);
      font-size: 0.8125rem;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    .avatar.small {
      width: 2rem;
      height: 2rem;
      font-size: 0.75rem;
    }
  `,
})
export class Avatar {
  readonly name = input.required<string>();
  readonly size = input<'normal' | 'small'>('normal');

  protected readonly initials = computed(() => {
    const words = this.name().trim().split(/\s+/).filter(Boolean);
    return words
      .slice(0, 2)
      .map((word) => word[0]!.toUpperCase())
      .join('');
  });
}

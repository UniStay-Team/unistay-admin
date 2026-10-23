import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty">
      <span class="icon"><i [class]="'pi ' + icon()" aria-hidden="true"></i></span>
      <strong>{{ title() }}</strong>
      <span>{{ text() }}</span>
    </div>
  `,
  styles: `
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.375rem;
      padding: 3rem 1rem;
      text-align: center;
      color: var(--p-text-muted-color);
    }
    .icon {
      display: grid;
      place-items: center;
      width: 3rem;
      height: 3rem;
      margin-bottom: 0.5rem;
      border-radius: 50%;
      background: var(--p-highlight-background);
      color: var(--p-highlight-color);
      font-size: 1.25rem;
    }
    strong {
      color: var(--p-text-color);
      font-size: 1rem;
    }
  `,
})
export class EmptyState {
  readonly icon = input.required<string>();
  readonly title = input.required<string>();
  readonly text = input.required<string>();
}

import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-page-header',
  imports: [ButtonModule],
  template: `
    <header class="page-header">
      <div>
        <h1>{{ title() }}</h1>
        <p>
          {{ description() }}
          @if (count() !== null) {
            <span class="count">Всего: {{ count() }}</span>
          }
        </p>
      </div>
      <p-button
        label="Обновить"
        icon="pi pi-refresh"
        severity="secondary"
        [outlined]="true"
        [loading]="loading()"
        (onClick)="refresh.emit()"
      />
    </header>
  `,
  styles: `
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1.25rem;
    }
    h1 {
      margin: 0 0 0.25rem;
      font-size: 1.5rem;
      font-weight: 700;
    }
    p {
      margin: 0;
      color: var(--p-text-muted-color);
    }
    .count {
      display: inline-block;
      margin-left: 0.5rem;
      padding: 0.0625rem 0.5rem;
      border-radius: 999px;
      background: var(--p-highlight-background);
      color: var(--p-highlight-color);
      font-size: 0.75rem;
      font-weight: 600;
    }
  `,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  // null — количество ещё неизвестно (первая загрузка или ошибка).
  readonly count = input<number | null>(null);
  readonly loading = input(false);
  readonly refresh = output();
}

import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ThemeService } from './core/theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  // Создаётся при старте, чтобы сохранённая тема применилась и на странице входа.
  protected readonly theme = inject(ThemeService);
}

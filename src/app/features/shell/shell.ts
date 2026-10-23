import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { AuthService } from '../../core/auth.service';
import { ThemeService } from '../../core/theme';
import { Avatar } from '../../shared/avatar';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  permission: string;
}

const MENU: MenuItem[] = [
  { path: 'applications', label: 'Заявки', icon: 'pi-file-check', permission: 'applications.read' },
  { path: 'listings', label: 'Объявления', icon: 'pi-building', permission: 'listings.read' },
  { path: 'users', label: 'Пользователи', icon: 'pi-users', permission: 'users.read' },
];

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule, Avatar],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly theme = inject(ThemeService);

  protected readonly admin = this.auth.admin;
  // Скрытие пунктов меню — только навигация; сервер всё равно проверяет право.
  protected readonly menu = computed(() =>
    MENU.filter((item) => this.admin()?.permissions.includes(item.permission)),
  );

  protected logout(): void {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }
}

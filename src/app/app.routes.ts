import { Routes } from '@angular/router';

import { authGuard } from './core/auth.guard';
import { LoginPage } from './features/auth/login.page';

// Разделы панели загружаются лениво: таблицы PrimeNG не входят в начальный bundle страницы входа.
export const routes: Routes = [
  { path: 'login', component: LoginPage, title: 'Вход — UniStay Admin' },
  {
    path: '',
    loadComponent: () => import('./features/shell/shell').then((m) => m.Shell),
    canActivate: [authGuard],
    children: [
      {
        path: 'users',
        loadComponent: () => import('./features/users/users.page').then((m) => m.UsersPage),
        title: 'Пользователи — UniStay Admin',
      },
      {
        path: 'listings',
        loadComponent: () =>
          import('./features/listings/listings.page').then((m) => m.ListingsPage),
        title: 'Объявления — UniStay Admin',
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./features/applications/applications.page').then((m) => m.ApplicationsPage),
        title: 'Заявки — UniStay Admin',
      },
      { path: '', pathMatch: 'full', redirectTo: 'applications' },
    ],
  },
  { path: '**', redirectTo: '' },
];

import { HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { apiUrl } from './api.config';
import { authInterceptor } from './auth.interceptor';
import { AdminMe, AuthService } from './auth.service';

const admin: AdminMe = {
  id: 4,
  email: 'demo-admin@example.test',
  name: 'Демо администратор',
  permissions: ['users.read', 'listings.read', 'applications.read'],
};

describe('AuthService', () => {
  let auth: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'login', children: [] }]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('logs in and loads admin/me with the new token', () => {
    let result: AdminMe | undefined;
    auth.login('demo-admin@example.test', 'secret').subscribe((me) => (result = me));

    const login = http.expectOne(apiUrl('auth/login/'));
    expect(login.request.body).toEqual({ email: 'demo-admin@example.test', password: 'secret' });
    login.flush({ token: 'abc', expires_at: '2026-10-24T10:00:00Z', user: {} });

    const me = http.expectOne(apiUrl('admin/me/'));
    expect(me.request.headers.get('Authorization')).toBe('Bearer abc');
    me.flush(admin);

    expect(result).toEqual(admin);
    expect(auth.isLoggedIn()).toBe(true);
    expect(auth.hasPermission('users.read')).toBe(true);
    expect(auth.hasPermission('users.update')).toBe(false);
  });

  it('drops the session when admin/me returns 403', () => {
    let failure: HttpErrorResponse | undefined;
    auth.login('demo-student@example.test', 'secret').subscribe({ error: (e) => (failure = e) });

    http.expectOne(apiUrl('auth/login/')).flush({ token: 'student', expires_at: '', user: {} });
    http
      .expectOne(apiUrl('admin/me/'))
      .flush({ error: { status: 403, details: 'Требуются административные права.' } }, { status: 403, statusText: 'Forbidden' });
    // Сессию обычного пользователя отзываем на сервере.
    const logout = http.expectOne(apiUrl('auth/logout/'));
    expect(logout.request.headers.get('Authorization')).toBe('Bearer student');
    logout.flush(null, { status: 204, statusText: 'No Content' });

    expect(failure?.status).toBe(403);
    expect(auth.token()).toBeNull();
    expect(auth.isLoggedIn()).toBe(false);
  });
});

import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { apiUrl } from './api.config';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('authInterceptor', () => {
  let client: HttpClient;
  let http: HttpTestingController;
  let auth: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'login', children: [] }]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    client = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);

    auth.login('demo-admin@example.test', 'secret').subscribe();
    http.expectOne(apiUrl('auth/login/')).flush({ token: 'abc', expires_at: '', user: {} });
    http.expectOne(apiUrl('admin/me/')).flush({ id: 1, email: 'a', name: 'A', permissions: [] });
  });

  afterEach(() => http.verify());

  it('adds the token only to the configured API', () => {
    client.get(apiUrl('admin/users/')).subscribe();
    client.get('https://example.test/other').subscribe();

    expect(http.expectOne(apiUrl('admin/users/')).request.headers.get('Authorization')).toBe('Bearer abc');
    expect(http.expectOne('https://example.test/other').request.headers.has('Authorization')).toBe(false);
  });

  it('clears the session on 401', () => {
    client.get(apiUrl('admin/users/')).subscribe({ error: () => undefined });
    http
      .expectOne(apiUrl('admin/users/'))
      .flush({ error: { status: 401, details: 'Недействительная сессия.' } }, { status: 401, statusText: 'Unauthorized' });

    expect(auth.token()).toBeNull();
    expect(auth.isLoggedIn()).toBe(false);
  });
});

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
  includeBearerTokenInterceptor,
  provideKeycloak,
} from 'keycloak-angular';

// Attach the access token only to our own API, never to third-party URLs.
const apiTokenCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^\/api(\/.*)?$/i,
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideKeycloak({
      config: {
        // The browser talks to Keycloak directly, so this is the public URL.
        url: 'http://localhost:8080',
        realm: 'phonebook',
        clientId: 'phonebook-frontend',
      },
      initOptions: {
        // Redirect to the Keycloak login page before the app renders.
        onLoad: 'login-required',
        pkceMethod: 'S256',
        // Avoids a hidden iframe that modern browsers block (third-party cookies).
        checkLoginIframe: false,
      },
    }),
    { provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, useValue: [apiTokenCondition] },
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
  ],
};

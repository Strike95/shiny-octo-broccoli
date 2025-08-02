import { ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { routes } from './app.routes';
import { Observable } from 'rxjs';
/**
 * Custom translation loader for Angular 20 compatibility
 * Implements TranslateLoader interface directly to avoid version conflicts
 * Design choice: Direct HTTP implementation for better control and compatibility
 */
export class CustomTranslateLoader implements TranslateLoader {
  constructor(private readonly _http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    return this._http.get(`/assets/i18n/${lang}.json`);
  }
}

/**
 * Factory function to create custom translation loader
 */
export function createTranslateLoader(http: HttpClient): TranslateLoader {
  return new CustomTranslateLoader(http);
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    // Router configuration with WCAG 2.2 AA accessibility support
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top', // Restore scroll to top for accessible navigation
        anchorScrolling: 'enabled' // Enable anchor navigation for screen readers
      })
    ),
    provideHttpClient(),
    // ngx-translate configuration for internationalization
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        },
        defaultLanguage: 'en' // Fallback language for accessibility
      })
    )
  ]
};

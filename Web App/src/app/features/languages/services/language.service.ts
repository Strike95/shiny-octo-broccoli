import { Injectable, signal, computed } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Interface to define a supported language
 * Design choice: Typed structure to ensure consistency
 */
export interface SupportedLanguage {
  readonly code: string;
  readonly name: string;
  readonly flag: string;
}

/**
 * Service for internationalization management
 * Design choice: Using Angular signals for optimal reactivity
 * Supports WCAG 2.2 AA through status announcements for screen readers
 */
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  /**
   * Languages supported by the application
   * Design choice: Readonly array to prevent accidental modifications
   */
  private readonly _supportedLanguages: readonly SupportedLanguage[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ] as const;

  /**
   * Signal for current language
   * Design choice: Signal for automatic component reactivity
   */
  private readonly _currentLanguage = signal<string>('en');

  /**
   * Computed signal for current language object
   * Design choice: Computed signal to derive data from current language
   */
  public readonly currentLanguageObj = computed(() => 
    this._supportedLanguages.find(lang => lang.code === this._currentLanguage()) ?? this._supportedLanguages[0]
  );

  /**
   * Getter for supported languages
   * Design choice: Readonly exposure to prevent external modifications
   */
  public get supportedLanguages(): readonly SupportedLanguage[] {
    return this._supportedLanguages;
  }

  /**
   * Getter for current language
   * Design choice: Signal exposure for reactivity in components
   */
  public get currentLanguage() {
    return this._currentLanguage.asReadonly();
  }

  constructor(private readonly _translateService: TranslateService) {
    this._initializeLanguage();
  }

  /**
   * Initialize language based on browser/localStorage preferences
   * Design choice: Fallback chain to ensure always valid language
   */
  private _initializeLanguage(): void {
    const savedLang = localStorage.getItem('preferred-language');
    const browserLang = navigator.language.split('-')[0];
    
    let langToUse = 'en'; // Default fallback
    
    if (this._isLanguageSupported(savedLang)) {
      langToUse = savedLang;
    } else if (this._isLanguageSupported(browserLang)) {
      langToUse = browserLang;
    }
                      
    this._setLanguage(langToUse);
  }

  /**
   * Check if a language is supported
   * Design choice: Type guard for type safety
   */
  private _isLanguageSupported(lang: string | null): lang is string {
    return lang !== null && this._supportedLanguages.some(supported => supported.code === lang);
  }

  /**
   * Set current language
   * Design choice: Private method to centralize language change logic
   */
  private _setLanguage(languageCode: string): void {
    this._translateService.use(languageCode);
    this._currentLanguage.set(languageCode);
    localStorage.setItem('preferred-language', languageCode);
    
    // Accessibility: Update document lang attribute for screen readers
    document.documentElement.lang = languageCode;
  }

  /**
   * Change current language
   * Design choice: Public method with validation for safety
   */
  public changeLanguage(languageCode: string): void {
    if (this._isLanguageSupported(languageCode)) {
      this._setLanguage(languageCode);
      
      // WCAG 2.2 AA Accessibility: Announce language change for screen readers
      this._announceLanguageChange(languageCode);
    }
  }

  /**
   * Announce language change for accessibility
   * Design choice: Screen reader support through aria-live region
   */
  private _announceLanguageChange(languageCode: string): void {
    const languageName = this._supportedLanguages.find(lang => lang.code === languageCode)?.name;
    
    if (languageName) {
      // Create temporary element for accessibility announcement
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only'; // Screen reader only class
      announcement.textContent = `Language changed to ${languageName}`;
      
      document.body.appendChild(announcement);
      
      // Remove element after announcement
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }
}

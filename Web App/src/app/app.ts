import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from './design-system/components/header/header.component';
import { LanguageService } from './features/languages/services/language.service';

/**
 * Root application component
 * Design choice: Standalone component with centralized i18n management
 * Implements WCAG 2.2 AA through:
 * - Translation service initialization
 * - Global accessibility configuration  
 * - document.lang management for screen readers
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('energy-market');
  
  private readonly _translateService = inject(TranslateService);
  private readonly _languageService = inject(LanguageService);

  public ngOnInit(): void {
    this._initializeTranslations();
  }

  /**
   * Initialize translation system with proper fallbacks
   * Design choice: Centralized configuration ensures consistency
   */
  private _initializeTranslations(): void {
    // Set up supported languages
    this._translateService.addLangs(['en', 'it']);
    
    // Configure fallback language for accessibility
    this._translateService.setDefaultLang('en');
    
    // LanguageService will automatically handle initial language
    // based on localStorage or browser preferences
  }
}

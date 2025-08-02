import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService, SupportedLanguage } from './services/language.service';
import { DropdownComponent } from '../../design-system/components/dropdown/dropdown.component';

/**
 * Component per la selezione della lingua
 * Design choice: Standalone component per riutilizzabilità
 * Implementa WCAG 2.2 AA attraverso:
 * - Supporto keyboard navigation
 * - ARIA labels appropriati
 * - Focus management
 */
@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule, DropdownComponent],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent {
  /**
   * Injection del LanguageService
   * Design choice: inject() function per Angular 20 best practices
   */
  private readonly _languageService = inject(LanguageService);

  /**
   * Available languages for selection
   * ARCHITECTURAL DECISION: Creates mutable array from readonly service data
   */
  protected readonly availableLanguages = computed(() => [...this._languageService.supportedLanguages]);

  /**
   * Current selected language
   * Reactive to language service changes
   */
  protected readonly currentLanguage = computed(() => this._languageService.currentLanguageObj());

  /**
   * Helper methods for dropdown integration
   * DESIGN PATTERN: Adapter pattern to interface with generic dropdown
   */
  protected readonly getLanguageDisplayText = (language: SupportedLanguage) => language.name;
  protected readonly getLanguageKey = (language: SupportedLanguage) => language.code;
  protected readonly isLanguageActive = (language: SupportedLanguage) => language.code === this.currentLanguage().code;
  protected readonly getLanguageFlag = (language: SupportedLanguage) => language.flag;

  /**
   * Handle language selection
   * 
   * ARCHITECTURAL DECISION: Delegates to LanguageService for state management
   * - Maintains separation of concerns
   * - Allows for centralized language change logic
   * - Supports future extensions like analytics tracking
   * 
   * @param language - Selected language object
   */
  protected onLanguageChange(language: SupportedLanguage): void {
    if (language && language.code !== this.currentLanguage().code) {
      this._languageService.changeLanguage(language.code);
    }
  }
}

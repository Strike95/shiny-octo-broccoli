import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, provideZonelessChangeDetection } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { LanguageSelectorComponent } from './language-selector.component';
import { LanguageService, SupportedLanguage } from './services/language.service';
import { DropdownComponent } from '../../design-system/components/dropdown/dropdown.component';

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;
  let mockLanguageService: jasmine.SpyObj<LanguageService>;

  const mockSupportedLanguages: SupportedLanguage[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ];

  const mockCurrentLanguage: SupportedLanguage = mockSupportedLanguages[0];
  
  // Create a writable signal for testing
  const mockCurrentLanguageSignal = signal(mockCurrentLanguage);

  beforeEach(async () => {
    const languageServiceSpy = jasmine.createSpyObj('LanguageService', ['changeLanguage'], {
      supportedLanguages: mockSupportedLanguages,
      currentLanguageObj: mockCurrentLanguageSignal
    });
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant', 'get'], {
      onLangChange: { subscribe: jasmine.createSpy('subscribe') },
      onTranslationChange: { subscribe: jasmine.createSpy('subscribe') },
      onDefaultLangChange: { subscribe: jasmine.createSpy('subscribe') }
    });

    // Add proper return values for TranslateService
    translateServiceSpy.instant.and.returnValue('Mocked Translation');
    translateServiceSpy.get.and.returnValue(of('Mocked Translation'));

    await TestBed.configureTestingModule({
      imports: [
        LanguageSelectorComponent,
        DropdownComponent
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    mockLanguageService = TestBed.inject(LanguageService) as jasmine.SpyObj<LanguageService>;
    
    // Reset the signal to initial state for each test
    mockCurrentLanguageSignal.set(mockCurrentLanguage);
    
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('computed properties', () => {
    it('should get available languages from service', () => {
      const languages = component['availableLanguages']();
      expect(languages).toEqual(mockSupportedLanguages);
      expect(languages).not.toBe(mockSupportedLanguages); // Should be a copy
    });

    it('should get current language from service', () => {
      const currentLang = component['currentLanguage']();
      expect(currentLang).toEqual(mockCurrentLanguage);
    });
  });

  describe('helper methods', () => {
    const testLanguage: SupportedLanguage = { code: 'en', name: 'English', flag: '🇺🇸' };

    it('should get language display text', () => {
      const displayText = component['getLanguageDisplayText'](testLanguage);
      expect(displayText).toBe('English');
    });

    it('should get language key', () => {
      const key = component['getLanguageKey'](testLanguage);
      expect(key).toBe('en');
    });

    it('should check if language is active', () => {
      const isActive = component['isLanguageActive'](testLanguage);
      expect(isActive).toBe(true); // Current language is 'en'
    });

    it('should check if language is not active', () => {
      const inactiveLanguage: SupportedLanguage = { code: 'it', name: 'Italiano', flag: '🇮🇹' };
      const isActive = component['isLanguageActive'](inactiveLanguage);
      expect(isActive).toBe(false);
    });

    it('should get language flag', () => {
      const flag = component['getLanguageFlag'](testLanguage);
      expect(flag).toBe('🇺🇸');
    });
  });

  describe('language change', () => {
    it('should change language when different language is selected', () => {
      const newLanguage: SupportedLanguage = { code: 'it', name: 'Italiano', flag: '🇮🇹' };
      
      component['onLanguageChange'](newLanguage);

      expect(mockLanguageService.changeLanguage).toHaveBeenCalledWith('it');
    });

    it('should not change language when same language is selected', () => {
      const sameLanguage: SupportedLanguage = { code: 'en', name: 'English', flag: '🇺🇸' };
      
      component['onLanguageChange'](sameLanguage);

      expect(mockLanguageService.changeLanguage).not.toHaveBeenCalled();
    });

    it('should handle null language gracefully', () => {
      component['onLanguageChange'](null as any);

      expect(mockLanguageService.changeLanguage).not.toHaveBeenCalled();
    });

    it('should handle undefined language gracefully', () => {
      component['onLanguageChange'](undefined as any);

      expect(mockLanguageService.changeLanguage).not.toHaveBeenCalled();
    });
  });

  describe('reactive updates', () => {
    it('should update current language when service changes', () => {
      const newLanguage: SupportedLanguage = { code: 'it', name: 'Italiano', flag: '🇮🇹' };
      
      // Update the signal value directly
      mockCurrentLanguageSignal.set(newLanguage);
      
      // autoDetectChanges will handle change detection

      const currentLang = component['currentLanguage']();
      expect(currentLang).toEqual(newLanguage);
    });

    it('should update active language check when current language changes', () => {
      const italianLanguage: SupportedLanguage = { code: 'it', name: 'Italiano', flag: '🇮🇹' };
      const englishLanguage: SupportedLanguage = { code: 'en', name: 'English', flag: '🇺🇸' };

      // Initially English should be active
      expect(component['isLanguageActive'](englishLanguage)).toBe(true);
      expect(component['isLanguageActive'](italianLanguage)).toBe(false);

      // Change to Italian
      mockCurrentLanguageSignal.set(italianLanguage);
      // autoDetectChanges will handle change detection

      // Now Italian should be active
      expect(component['isLanguageActive'](englishLanguage)).toBe(false);
      expect(component['isLanguageActive'](italianLanguage)).toBe(true);
    });
  });
});

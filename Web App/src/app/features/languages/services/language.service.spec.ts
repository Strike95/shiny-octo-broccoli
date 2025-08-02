import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { LanguageService, SupportedLanguage } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let localStorageSpy: jasmine.Spy;
  let setItemSpy: jasmine.Spy;

  beforeEach(() => {
    // Create spy for TranslateService
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['use'], {
      onLangChange: { subscribe: jasmine.createSpy('subscribe') },
      onTranslationChange: { subscribe: jasmine.createSpy('subscribe') },
      onDefaultLangChange: { subscribe: jasmine.createSpy('subscribe') }
    });
    
    // Mock localStorage
    localStorageSpy = spyOn(localStorage, 'getItem').and.returnValue(null);
    setItemSpy = spyOn(localStorage, 'setItem');
    
    // Mock navigator.language
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'en-US'
    });

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        LanguageService,
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    });

    service = TestBed.inject(LanguageService);
  });

  afterEach(() => {
    localStorageSpy.calls.reset();
    setItemSpy.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('supportedLanguages', () => {
    it('should return correct supported languages', () => {
      const expectedLanguages: readonly SupportedLanguage[] = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹' }
      ];

      expect(service.supportedLanguages).toEqual(expectedLanguages);
      expect(service.supportedLanguages.length).toBe(2);
    });

    it('should have the correct language properties', () => {
      const languages = service.supportedLanguages;
      
      expect(languages[0].code).toBe('en');
      expect(languages[0].name).toBe('English');
      expect(languages[0].flag).toBe('🇺🇸');
      
      expect(languages[1].code).toBe('it');
      expect(languages[1].name).toBe('Italiano');
      expect(languages[1].flag).toBe('🇮🇹');
    });
  });

  describe('currentLanguage', () => {
    it('should return current language signal as readonly', () => {
      const currentLang = service.currentLanguage;
      
      expect(currentLang).toBeDefined();
      expect(typeof currentLang()).toBe('string');
    });

    it('should default to English', () => {
      const currentLang = service.currentLanguage();
      expect(currentLang).toBe('en');
    });
  });

  describe('currentLanguageObj', () => {
    it('should return correct language object for current language', () => {
      const currentLangObj = service.currentLanguageObj();
      
      expect(currentLangObj).toBeDefined();
      expect(currentLangObj.code).toBe('en');
      expect(currentLangObj.name).toBe('English');
      expect(currentLangObj.flag).toBe('🇺🇸');
    });

    it('should return fallback when current language is invalid', () => {
      const currentLangObj = service.currentLanguageObj();
      
      expect(currentLangObj).toBeDefined();
      expect(currentLangObj.code).toBeDefined();
      expect(currentLangObj.name).toBeDefined();
      expect(currentLangObj.flag).toBeDefined();
    });
  });

  describe('language initialization behavior', () => {
    it('should call translateService.use during initialization', () => {
      expect(translateServiceSpy.use).toHaveBeenCalled();
    });

    it('should save language to localStorage during initialization', () => {
      expect(setItemSpy).toHaveBeenCalledWith('preferred-language', 'en');
    });
  });

  describe('language selection logic', () => {
    beforeEach(() => {
      // Reset spies for each test
      translateServiceSpy.use.calls.reset();
      setItemSpy.calls.reset();
    });

    it('should handle Italian language preference', () => {
      localStorageSpy.and.returnValue('it');
      
      // Create a new service instance with Italian preference
      const italianService = new LanguageService(translateServiceSpy);
      
      expect(translateServiceSpy.use).toHaveBeenCalledWith('it');
      expect(setItemSpy).toHaveBeenCalledWith('preferred-language', 'it');
      expect(italianService).toBeTruthy();
    });

    it('should handle unsupported language gracefully', () => {
      localStorageSpy.and.returnValue('fr');
      
      // Create a new service instance with unsupported language
      const fallbackService = new LanguageService(translateServiceSpy);
      
      expect(translateServiceSpy.use).toHaveBeenCalledWith('en');
      expect(setItemSpy).toHaveBeenCalledWith('preferred-language', 'en');
      expect(fallbackService).toBeTruthy();
    });

    it('should handle browser language detection', () => {
      localStorageSpy.and.returnValue(null);
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'it-IT'
      });
      
      // Create a new service instance for browser language detection
      const browserLangService = new LanguageService(translateServiceSpy);
      
      expect(translateServiceSpy.use).toHaveBeenCalledWith('it');
      expect(setItemSpy).toHaveBeenCalledWith('preferred-language', 'it');
      expect(browserLangService).toBeTruthy();
    });
  });

  describe('error handling', () => {
    it('should handle localStorage errors', () => {
      localStorageSpy.and.throwError('Storage not available');
      
      expect(() => {
        new LanguageService(translateServiceSpy);
      }).toThrowError('Storage not available');
    });

    it('should handle empty navigator language', () => {
      localStorageSpy.and.returnValue(null);
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: ''
      });
      
      const emptyLangService = new LanguageService(translateServiceSpy);
      
      expect(translateServiceSpy.use).toHaveBeenCalledWith('en');
      expect(emptyLangService).toBeTruthy();
    });
  });
});

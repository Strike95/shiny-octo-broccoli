import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { signal, provideZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';

import { HeaderComponent } from './header.component';
import { NavigationService } from '../../../features/navigation/services/navigation.service';
import { LanguageService } from '../../../features/languages/services/language.service';
import { NavigationComponent } from '../navigation/navigation.component';
import { LanguageSelectorComponent } from '../../../features/languages/language-selector.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  const mockNavigationItems = [
    { route: '/home', labelKey: 'HOME.TITLE', icon: 'bi-house' },
    { route: '/electricity-prices', labelKey: 'ELECTRICITY_PRICES.TITLE', icon: 'bi-lightning' },
    { route: '/green-certificates', labelKey: 'GREEN_CERTIFICATES.TITLE', icon: 'bi-award' }
  ];

  const mockSupportedLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ];

  // Create a writable signal for testing
  const mockNavigationSignal = signal(mockNavigationItems);

  beforeEach(async () => {
    const navigationServiceSpy = jasmine.createSpyObj('NavigationService', ['navigateTo'], {
      mainNavigationItems: mockNavigationSignal
    });
    const languageServiceSpy = jasmine.createSpyObj('LanguageService', ['changeLanguage'], {
      supportedLanguages: mockSupportedLanguages,
      currentLanguageObj: signal(mockSupportedLanguages[0])
    });
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant', 'get'], {
      onLangChange: { subscribe: jasmine.createSpy() },
      onTranslationChange: { subscribe: jasmine.createSpy() },
      onDefaultLangChange: { subscribe: jasmine.createSpy() }
    });

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        RouterTestingModule,
        NgbDropdownModule,
        NavigationComponent,
        LanguageSelectorComponent
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: NavigationService, useValue: navigationServiceSpy },
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    mockNavigationService = TestBed.inject(NavigationService) as jasmine.SpyObj<NavigationService>;
    mockTranslateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;

    // Default mock implementations
    mockTranslateService.instant.and.returnValue('Mocked Translation');
    mockTranslateService.get.and.returnValue(of('Mocked Translation'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize accessibility features on init', () => {
      spyOn(component as any, '_initializeAccessibilityFeatures');
      
      component.ngOnInit();

      expect((component as any)._initializeAccessibilityFeatures).toHaveBeenCalled();
    });

    it('should set up keyboard navigation on init', () => {
      spyOn(component as any, '_setupKeyboardNavigation');
      
      component.ngOnInit();

      expect((component as any)._setupKeyboardNavigation).toHaveBeenCalled();
    });
  });

  describe('navigation items', () => {
    beforeEach(() => {
      // Reset the navigation signal to original state
      mockNavigationSignal.set(mockNavigationItems);
      // autoDetectChanges will handle change detection
    });
    
    it('should get navigation items from service', () => {
      const navigationItems = component['navigationItems']();
      
      expect(navigationItems).toHaveSize(3);
      expect(navigationItems[0].route).toBe('/home');
      expect(navigationItems[0].labelKey).toBe('HOME.TITLE');
      expect(navigationItems[0].icon).toBe('bi-house');
    });

    it('should include translated aria labels for navigation items', () => {
      mockTranslateService.instant.and.returnValue('Home');
      
      const navigationItems = component['navigationItems']();
      
      expect(navigationItems[0].ariaLabel).toBe('Home');
      expect(mockTranslateService.instant).toHaveBeenCalledWith('HOME.TITLE');
    });
  });

  describe('mobile menu', () => {
    it('should start with mobile menu closed', () => {
      expect(component['isMobileMenuExpanded']()).toBe(false);
    });

    it('should toggle mobile menu state', () => {
      component['toggleMobileMenu']();
      expect(component['isMobileMenuExpanded']()).toBe(true);

      component['toggleMobileMenu']();
      expect(component['isMobileMenuExpanded']()).toBe(false);
    });

    it('should close mobile menu', () => {
      // First open the menu
      component['toggleMobileMenu']();
      expect(component['isMobileMenuExpanded']()).toBe(true);

      // Then close it
      component['closeMobileMenu']();
      expect(component['isMobileMenuExpanded']()).toBe(false);
    });
  });

  describe('navigation handling', () => {
    it('should navigate using navigation service when item is clicked', () => {
      const route = '/test-route';
      
      component['onNavigationItemClick'](route);

      expect(mockNavigationService.navigateTo).toHaveBeenCalledWith(route);
    });

    it('should close mobile menu when navigation item is clicked', () => {
      // Open mobile menu first
      component['toggleMobileMenu']();
      expect(component['isMobileMenuExpanded']()).toBe(true);

      // Click navigation item
      component['onNavigationItemClick']('/test-route');

      expect(component['isMobileMenuExpanded']()).toBe(false);
    });
  });

  describe('accessibility features', () => {
    it('should skip to main content when requested', () => {
      const mockMainContent = jasmine.createSpyObj('HTMLElement', ['focus', 'scrollIntoView']);
      spyOn(document, 'getElementById').and.returnValue(mockMainContent);

      component['skipToMainContent']();

      expect(document.getElementById).toHaveBeenCalledWith('main-content');
      expect(mockMainContent.focus).toHaveBeenCalled();
      expect(mockMainContent.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('should handle missing main content element gracefully', () => {
      spyOn(document, 'getElementById').and.returnValue(null);

      expect(() => component['skipToMainContent']()).not.toThrow();
    });
  });

  describe('brand text input', () => {
    it('should accept brand text input', () => {
      const brandText = 'Custom Brand';
      
      fixture.componentRef.setInput('brandText', brandText);
      
      expect(component.brandText()).toBe(brandText);
    });

    it('should handle undefined brand text', () => {
      expect(component.brandText()).toBeUndefined();
    });
  });

  describe('reactive updates', () => {
    it('should update navigation items when service changes', () => {
      const newItems = [
        { route: '/new-route', labelKey: 'NEW.TITLE', icon: 'bi-new' }
      ];

      // Update the signal value directly
      mockNavigationSignal.set(newItems);

      // autoDetectChanges will handle change detection

      const navigationItems = component['navigationItems']();
      expect(navigationItems).toHaveSize(1);
      expect(navigationItems[0].route).toBe('/new-route');
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { NavigationService } from './navigation.service';
import { Subject } from 'rxjs';

describe('NavigationService', () => {
  let service: NavigationService;
  let routerSpy: jasmine.SpyObj<Router>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let routerEventsSubject: Subject<any>;

  beforeEach(() => {
    routerEventsSubject = new Subject();
    
    routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
      events: routerEventsSubject.asObservable(),
      url: '/'
    });
    
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        NavigationService,
        { provide: Router, useValue: routerSpy },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    });

    service = TestBed.inject(NavigationService);
  });

  afterEach(() => {
    routerEventsSubject.complete();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('navigationConfig', () => {
    it('should return correct navigation configuration', () => {
      const config = service.navigationConfig();
      
      expect(config).toBeDefined();
      expect(config.length).toBe(3);
      
      // Check electricity prices config
      expect(config[0].route).toBe('/electricity-prices');
      expect(config[0].labelKey).toBe('NAVIGATION.ELECTRICITY_PRICES');
      expect(config[0].icon).toBe('bi bi-graph-up');
      expect(config[0].category).toBe('data');
      expect(config[0].order).toBe(1);
      expect(config[0].requiresAuth).toBe(false);
      
      // Check green certificates config
      expect(config[1].route).toBe('/green-certificates');
      expect(config[1].labelKey).toBe('NAVIGATION.GREEN_CERTIFICATES');
      expect(config[1].icon).toBe('bi bi-award');
      expect(config[1].category).toBe('data');
      expect(config[1].order).toBe(2);
      
      // Check market analysis config
      expect(config[2].route).toBe('/market-analysis');
      expect(config[2].labelKey).toBe('NAVIGATION.MARKET_ANALYSIS');
      expect(config[2].icon).toBe('bi bi-bar-chart');
      expect(config[2].category).toBe('analysis');
      expect(config[2].order).toBe(3);
    });

    it('should have all navigation items with required properties', () => {
      const config = service.navigationConfig();
      
      config.forEach(item => {
        expect(item.route).toBeDefined();
        expect(item.labelKey).toBeDefined();
        expect(item.icon).toBeDefined();
        expect(item.description).toBeDefined();
        expect(item.category).toBeDefined();
        expect(item.order).toBeDefined();
        expect(typeof item.requiresAuth).toBe('boolean');
      });
    });
  });

  describe('mainNavigationItems', () => {
    it('should return navigation items for data and analysis categories', () => {
      const mainItems = service.mainNavigationItems();
      
      expect(mainItems.length).toBe(3);
      
      const categories = mainItems.map(item => item.category);
      expect(categories).toContain('data');
      expect(categories).toContain('analysis');
    });

    it('should maintain correct order', () => {
      const mainItems = service.mainNavigationItems();
      
      expect(mainItems[0].order).toBe(1);
      expect(mainItems[1].order).toBe(2);
      expect(mainItems[2].order).toBe(3);
    });
  });

  describe('dataNavigationItems', () => {
    it('should return only data category navigation items', () => {
      const dataItems = service.dataNavigationItems();
      
      expect(dataItems.length).toBe(2);
      dataItems.forEach(item => {
        expect(item.category).toBe('data');
      });
      
      expect(dataItems[0].route).toBe('/electricity-prices');
      expect(dataItems[1].route).toBe('/green-certificates');
    });
  });

  describe('navigateTo', () => {
    it('should navigate to specified route successfully', async () => {
      routerSpy.navigate.and.returnValue(Promise.resolve(true));
      
      const result = await service.navigateTo('/electricity-prices');
      
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/electricity-prices'], {
        queryParams: {},
        fragment: '',
        queryParamsHandling: 'merge'
      });
      expect(result).toBe(true);
    });

    it('should navigate with query parameters and fragment', async () => {
      routerSpy.navigate.and.returnValue(Promise.resolve(true));
      const queryParams = { year: 2023, market: 'ipex' };
      const fragment = 'section1';
      
      const result = await service.navigateTo('/market-analysis', queryParams, fragment);
      
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/market-analysis'], {
        queryParams: { year: 2023, market: 'ipex' },
        fragment: 'section1',
        queryParamsHandling: 'merge'
      });
      expect(result).toBe(true);
    });

    it('should handle navigation failure', async () => {
      routerSpy.navigate.and.returnValue(Promise.resolve(false));
      
      const result = await service.navigateTo('/invalid-route');
      
      expect(result).toBe(false);
    });

    it('should handle navigation error', async () => {
      routerSpy.navigate.and.returnValue(Promise.reject(new Error('Navigation failed')));
      spyOn(console, 'error');
      
      const result = await service.navigateTo('/error-route');
      
      expect(console.error).toHaveBeenCalledWith('Navigation error:', jasmine.any(Error));
      expect(result).toBe(false);
    });

    it('should track previous route', async () => {
      routerSpy.navigate.and.returnValue(Promise.resolve(true));
      
      // Navigate to first route
      await service.navigateTo('/electricity-prices');
      
      // Navigate to second route - should track previous
      await service.navigateTo('/green-certificates');
      
      expect(routerSpy.navigate).toHaveBeenCalledTimes(2);
    });
  });

  describe('navigateBack', () => {
    it('should navigate back to previous route', async () => {
      routerSpy.navigate.and.returnValue(Promise.resolve(true));
      
      // Set up a navigation history
      await service.navigateTo('/electricity-prices');
      await service.navigateTo('/green-certificates');
      
      // Navigate back
      const result = await service.navigateBack();
      
      expect(result).toBe(true);
      expect(routerSpy.navigate).toHaveBeenCalledTimes(3);
    });
  });

  describe('isRouteActive', () => {
    it('should return true for active route', () => {
      // Simulate route change
      routerEventsSubject.next(new NavigationEnd(1, '/electricity-prices', '/electricity-prices'));
      
      expect(service.isRouteActive('/electricity-prices')).toBe(true);
      expect(service.isRouteActive('/green-certificates')).toBe(false);
    });

    it('should return false for inactive route', () => {
      routerEventsSubject.next(new NavigationEnd(1, '/green-certificates', '/green-certificates'));
      
      expect(service.isRouteActive('/electricity-prices')).toBe(false);
      expect(service.isRouteActive('/green-certificates')).toBe(true);
    });

    it('should handle routes with query parameters', () => {
      routerEventsSubject.next(new NavigationEnd(1, '/market-analysis?year=2023', '/market-analysis?year=2023'));
      
      expect(service.isRouteActive('/market-analysis')).toBe(true);
    });
  });

  describe('getRouteConfig', () => {
    it('should return correct route configuration', () => {
      const config = service.getRouteConfig('/electricity-prices');
      
      expect(config).toBeDefined();
      expect(config?.route).toBe('/electricity-prices');
      expect(config?.labelKey).toBe('NAVIGATION.ELECTRICITY_PRICES');
      expect(config?.category).toBe('data');
    });

    it('should return undefined for non-existent route', () => {
      const config = service.getRouteConfig('/non-existent-route');
      
      expect(config).toBeUndefined();
    });

    it('should return config for all available routes', () => {
      const electricityConfig = service.getRouteConfig('/electricity-prices');
      const certificatesConfig = service.getRouteConfig('/green-certificates');
      const analysisConfig = service.getRouteConfig('/market-analysis');
      
      expect(electricityConfig).toBeDefined();
      expect(certificatesConfig).toBeDefined();
      expect(analysisConfig).toBeDefined();
      
      expect(electricityConfig?.category).toBe('data');
      expect(certificatesConfig?.category).toBe('data');
      expect(analysisConfig?.category).toBe('analysis');
    });
  });

  describe('route tracking initialization', () => {
    it('should initialize with current router URL', () => {
      // The service should be initialized with the current router URL
      expect(service.isRouteActive('/')).toBe(true);
    });

    it('should track route changes through router events', () => {
      // Simulate navigation event
      routerEventsSubject.next(new NavigationEnd(1, '/electricity-prices', '/electricity-prices'));
      
      expect(service.isRouteActive('/electricity-prices')).toBe(true);
      expect(service.isRouteActive('/')).toBe(false);
    });

    it('should handle complex URLs with query parameters', () => {
      const complexUrl = '/market-analysis?year=2023&market=ipex#section1';
      routerEventsSubject.next(new NavigationEnd(1, complexUrl, complexUrl));
      
      expect(service.isRouteActive('/market-analysis')).toBe(true);
    });
  });
});

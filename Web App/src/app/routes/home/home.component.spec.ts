import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { HomeComponent } from './home.component';
import { EnergyMarketService } from '../../features/http/services/energy-market.service';
import { ElectricityPrice, GreenCertificate } from '../../features/http/models/energy-market.models';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockEnergyMarketService: jasmine.SpyObj<EnergyMarketService>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  const mockElectricityPrices: ElectricityPrice[] = [
    {
      year: 2023,
      ipex: 150.5,
      epex_germany: 145.0,
      nord_pool: 148.0,
      omel: 152.0,
      epex_france: 155.0
    },
    {
      year: 2024,
      ipex: 160.0,
      epex_germany: 155.0,
      nord_pool: 158.0,
      omel: 162.0,
      epex_france: 165.0
    }
  ];

  const mockGreenCertificates: GreenCertificate[] = [
    {
      year: 2023,
      weighted_avg_price: 50.0,
      cvs_traded: 1000,
      total_value_incl_vat: 61000
    },
    {
      year: 2024,
      weighted_avg_price: 60.0,
      cvs_traded: 1200,
      total_value_incl_vat: 73200
    }
  ];

  beforeEach(async () => {
    const energyMarketServiceSpy = jasmine.createSpyObj('EnergyMarketService', ['getElectricityPrices', 'getGreenCertificates']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant', 'get'], {
      onLangChange: { subscribe: jasmine.createSpy('subscribe') },
      onTranslationChange: { subscribe: jasmine.createSpy('subscribe') },
      onDefaultLangChange: { subscribe: jasmine.createSpy('subscribe') }
    });
    const mockActivatedRoute = {
      params: of({}),
      queryParams: of({}),
      snapshot: { params: {}, queryParams: {} }
    };

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: EnergyMarketService, useValue: energyMarketServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    mockEnergyMarketService = TestBed.inject(EnergyMarketService) as jasmine.SpyObj<EnergyMarketService>;
    mockTranslateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;

    // Default mock implementations
    mockEnergyMarketService.getElectricityPrices.and.returnValue(of(mockElectricityPrices));
    mockEnergyMarketService.getGreenCertificates.and.returnValue(of(mockGreenCertificates));
    mockTranslateService.instant.and.returnValue('Mocked Translation');
    mockTranslateService.get.and.returnValue(of({'APP.TITLE': 'Energy Market', 'HOME.TITLE': 'Home'}));
    
    fixture.autoDetectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load market data on init', () => {
      component.ngOnInit();

      expect(mockEnergyMarketService.getElectricityPrices).toHaveBeenCalled();
      expect(mockEnergyMarketService.getGreenCertificates).toHaveBeenCalled();
    });

    it('should set page title on init', () => {
      component.ngOnInit();

      expect(mockTranslateService.get).toHaveBeenCalledWith(['APP.TITLE', 'HOME.TITLE']);
    });
  });

  describe('computed properties', () => {
    beforeEach(() => {
      component.ngOnInit();
      // autoDetectChanges will handle change detection
    });

    it('should calculate latest electricity price correctly', () => {
      const latestPrice = component.latestElectricityPrice();
      expect(latestPrice).toBe(160.0);
    });

    it('should return null for latest electricity price when no data', () => {
      mockEnergyMarketService.getElectricityPrices.and.returnValue(of([]));
      component.ngOnInit();
      // autoDetectChanges will handle change detection

      const latestPrice = component.latestElectricityPrice();
      expect(latestPrice).toBeNull();
    });

    it('should calculate average electricity price correctly', () => {
      const averagePrice = component.averageElectricityPrice();
      expect(averagePrice).toBe(155.25); // (150.5 + 160.0) / 2
    });

    it('should calculate total green certificates correctly', () => {
      const totalCertificates = component.totalGreenCertificates();
      expect(totalCertificates).toBe(2200); // 1000 + 1200
    });

    it('should calculate certificates growth correctly', () => {
      const growth = component.certificatesGrowth();
      expect(growth).toBe(20); // ((1200 - 1000) / 1000) * 100
    });

    it('should return 0 for certificates growth when insufficient data', () => {
      mockEnergyMarketService.getGreenCertificates.and.returnValue(of([mockGreenCertificates[0]]));
      component.ngOnInit();
      // autoDetectChanges will handle change detection

      const growth = component.certificatesGrowth();
      expect(growth).toBe(0);
    });

    it('should calculate summary stats correctly', () => {
      const stats = component.summaryStats();
      
      expect(stats.totalYearsElectricity).toBe(2);
      expect(stats.totalYearsCertificates).toBe(2);
      expect(stats.avgElectricityPrice).toBe(155.25);
      expect(stats.maxElectricityPrice).toBe(160.0);
      expect(stats.totalCertificatesValue).toBe(134200); // 61000 + 73200
    });
  });

  describe('quick stats', () => {
    beforeEach(() => {
      component.ngOnInit();
      // autoDetectChanges will handle change detection
    });

    it('should generate quick stats with correct structure', () => {
      const stats = component.quickStats();
      
      expect(stats).toHaveSize(3);
      expect(stats[0].id).toBe('prices');
      expect(stats[1].id).toBe('certificates');
      expect(stats[2].id).toBe('analysis');
    });

    it('should show loading state when no data available', () => {
      mockEnergyMarketService.getElectricityPrices.and.returnValue(of([]));
      mockEnergyMarketService.getGreenCertificates.and.returnValue(of([]));
      component.ngOnInit();
      // autoDetectChanges will handle change detection

      const stats = component.quickStats();
      expect(stats[0].value).toBe('Loading...');
      expect(stats[1].value).toBe('Loading...');
      expect(stats[2].value).toBe('Loading...');
    });
  });

  describe('features data', () => {
    it('should provide correct features structure', () => {
      const features = component.features;
      
      expect(features).toHaveSize(3);
      expect(features[0].route).toBe('/electricity-prices');
      expect(features[1].route).toBe('/green-certificates');
      expect(features[2].route).toBe('/market-analysis');
    });
  });

  describe('error handling', () => {
    it('should handle electricity prices loading error', () => {
      mockEnergyMarketService.getElectricityPrices.and.returnValue(throwError(() => 'Error loading prices'));
      spyOn(console, 'error');

      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith('Error loading electricity prices:', 'Error loading prices');
      expect(component.error()).toBe('Failed to load electricity prices');
    });

    it('should handle green certificates loading error', () => {
      mockEnergyMarketService.getGreenCertificates.and.returnValue(throwError(() => 'Error loading certificates'));
      spyOn(console, 'error');

      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith('Error loading green certificates:', 'Error loading certificates');
    });

    it('should not overwrite existing error when green certificates fail', () => {
      mockEnergyMarketService.getElectricityPrices.and.returnValue(throwError(() => 'Electricity error'));
      mockEnergyMarketService.getGreenCertificates.and.returnValue(throwError(() => 'Certificates error'));

      component.ngOnInit();

      expect(component.error()).toBe('Failed to load electricity prices');
    });
  });

  describe('loading state', () => {
    it('should start with loading state', () => {
      // Create a fresh component without autoDetectChanges to test initial state
      const freshFixture = TestBed.createComponent(HomeComponent);
      const freshComponent = freshFixture.componentInstance;
      
      expect(freshComponent.isLoading()).toBe(true); // Initially true before data loads
    });

    it('should set loading to false when both data sources complete', () => {
      component.ngOnInit();
      
      // The loading state should be false after observables complete
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should track stats by id', () => {
      const stat = { id: 'test-id' };
      const result = component.trackByStatId(0, stat);
      expect(result).toBe('test-id');
    });

    it('should track features by id', () => {
      const feature = { id: 'test-feature-id' };
      const result = component.trackByFeatureId(0, feature);
      expect(result).toBe('test-feature-id');
    });

    it('should scroll to features section', () => {
      const mockElement = jasmine.createSpyObj('HTMLElement', ['scrollIntoView']);
      const mockFocusElement = jasmine.createSpyObj('HTMLElement', ['focus']);
      spyOn(document, 'getElementById').and.callFake((id: string) => {
        if (id === 'features') return mockElement;
        if (id === 'features-title') return mockFocusElement;
        return null;
      });

      component.scrollToFeatures();

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      });
    });

    it('should handle missing features element gracefully', () => {
      spyOn(document, 'getElementById').and.returnValue(null);

      expect(() => component.scrollToFeatures()).not.toThrow();
    });

    it('should generate get started aria label', () => {
      mockTranslateService.instant.and.returnValue('Get Started Aria Label');
      
      const result = component.getStartedAriaLabel();
      
      expect(result).toBe('Get Started Aria Label');
      expect(mockTranslateService.instant).toHaveBeenCalledWith('HOME.GET_STARTED_ARIA');
    });

    it('should generate feature aria label', () => {
      const feature = { title: 'FEATURE.TITLE' };
      mockTranslateService.instant.and.returnValue('Feature Title');
      
      const result = component.getFeatureAriaLabel(feature);
      
      expect(result).toBe('Explore Feature Title');
      expect(mockTranslateService.instant).toHaveBeenCalledWith('FEATURE.TITLE');
    });
  });
});

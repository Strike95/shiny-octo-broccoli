import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { provideZonelessChangeDetection } from '@angular/core';

import { MarketAnalysisComponent } from './market-analysis.component';
import { EnergyMarketService } from '../../features/http/services/energy-market.service';
import { CombinedData } from '../../features/http/models/energy-market.models';

describe('MarketAnalysisComponent', () => {
  let component: MarketAnalysisComponent;
  let fixture: ComponentFixture<MarketAnalysisComponent>;
  let mockEnergyMarketService: jasmine.SpyObj<EnergyMarketService>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  const mockCombinedData: CombinedData[] = [
    {
      year: 2023,
      ipex: 150.5,
      epex_germany: 145.0,
      nord_pool: 148.0,
      omel: 152.0,
      epex_france: 155.0,
      cv_price: 50.0,
      cvs_traded: 1000,
      total_value_incl_vat: 61000
    },
    {
      year: 2024,
      ipex: 160.0,
      epex_germany: 155.0,
      nord_pool: 158.0,
      omel: 162.0,
      epex_france: 165.0,
      cv_price: 60.0,
      cvs_traded: 1200,
      total_value_incl_vat: 73200
    }
  ];

  const mockOverlappingData = [
    { year: 2023, ipex: 150.5, cv_price: 50.0 },
    { year: 2024, ipex: 160.0, cv_price: 60.0 }
  ];

  const mockHighCvPrices = [
    { year: 2024, cv_price: 60.0, cvs_traded: 1200 }
  ];

  const mockMarketComparison = [
    { market: 'IPEX', price: 150.5 },
    { market: 'EPEX Germany', price: 145.0 }
  ];

  beforeEach(async () => {
    const energyMarketServiceSpy = jasmine.createSpyObj('EnergyMarketService', [
      'getCombinedData',
      'getOverlappingData', 
      'getHighCvPrices',
      'getMarketComparison'
    ]);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['get']);

    await TestBed.configureTestingModule({
      imports: [
        MarketAnalysisComponent
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: EnergyMarketService, useValue: energyMarketServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MarketAnalysisComponent);
    component = fixture.componentInstance;
    mockEnergyMarketService = TestBed.inject(EnergyMarketService) as jasmine.SpyObj<EnergyMarketService>;
    mockTranslateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;

    // Default mock implementations
    mockEnergyMarketService.getCombinedData.and.returnValue(of(mockCombinedData));
    mockEnergyMarketService.getOverlappingData.and.returnValue(of(mockOverlappingData));
    mockEnergyMarketService.getHighCvPrices.and.returnValue(of(mockHighCvPrices));
    mockEnergyMarketService.getMarketComparison.and.returnValue(of(mockMarketComparison));
    mockTranslateService.get.and.returnValue(of({'APP.TITLE': 'Energy Market', 'MARKET_ANALYSIS.TITLE': 'Market Analysis'}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load all analysis data on init', () => {
      component.ngOnInit();

      expect(mockEnergyMarketService.getCombinedData).toHaveBeenCalled();
      expect(mockEnergyMarketService.getOverlappingData).toHaveBeenCalled();
      expect(mockEnergyMarketService.getHighCvPrices).toHaveBeenCalled();
      expect(mockEnergyMarketService.getMarketComparison).toHaveBeenCalledWith(2020);
    });

    it('should set page title on init', () => {
      component.ngOnInit();

      expect(mockTranslateService.get).toHaveBeenCalledWith(['APP.TITLE', 'MARKET_ANALYSIS.TITLE']);
    });

    it('should set data correctly after loading', () => {
      component.ngOnInit();

      expect(component.combinedData()).toEqual(mockCombinedData);
      expect(component.overlappingData()).toEqual(mockOverlappingData);
      expect(component.highCvPrices()).toEqual(mockHighCvPrices);
      expect(component.marketComparison()).toEqual(mockMarketComparison);
    });
  });

  describe('error handling', () => {
    it('should handle combined data loading error', () => {
      const errorMessage = 'Network error';
      mockEnergyMarketService.getCombinedData.and.returnValue(throwError(() => errorMessage));
      spyOn(console, 'error');

      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith('Error loading combined data:', errorMessage);
      expect(component.error()).toBe('Failed to load market analysis data');
      expect(component.isLoading()).toBe(false);
    });

    it('should handle overlapping data loading error', () => {
      mockEnergyMarketService.getOverlappingData.and.returnValue(throwError(() => 'Overlapping error'));
      spyOn(console, 'error');

      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith('Error loading overlapping data:', 'Overlapping error');
    });

    it('should handle high CV prices loading error', () => {
      mockEnergyMarketService.getHighCvPrices.and.returnValue(throwError(() => 'High CV error'));
      spyOn(console, 'error');

      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith('Error loading high CV prices:', 'High CV error');
    });

    it('should handle market comparison loading error', () => {
      mockEnergyMarketService.getMarketComparison.and.returnValue(throwError(() => 'Market comparison error'));
      spyOn(console, 'error');

      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith('Error loading market comparison:', 'Market comparison error');
    });
  });

  describe('formatting methods', () => {
    it('should format price correctly', () => {
      const result = component.formatPrice(123.45);
      expect(result).toMatch(/123,45\s*€/);
    });

    it('should format null price as N/A', () => {
      const result = component.formatPrice(null);
      expect(result).toBe('N/A');
    });

    it('should format number correctly', () => {
      const result = component.formatNumber(123456);
      expect(result).toBe('123.456');
    });

    it('should format null number as N/A', () => {
      const result = component.formatNumber(null);
      expect(result).toBe('N/A');
    });
  });

  describe('price correlation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should calculate price correlation correctly', () => {
      const correlation = component.priceCorrelation;
      expect(correlation).toBeCloseTo(1, 5); // Perfect positive correlation for our test data
    });

    it('should return 0 for insufficient data', () => {
      component.overlappingData.set([]);
      const correlation = component.priceCorrelation;
      expect(correlation).toBe(0);
    });

    it('should handle NaN correlation', () => {
      component.overlappingData.set([
        { year: 2023, ipex: 150.5, cv_price: 50.0 }
      ]);
      const correlation = component.priceCorrelation;
      expect(correlation).toBe(0);
    });
  });

  describe('year management', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should change selected year and reload market comparison', () => {
      const newYear = 2023;
      
      component.changeYear(newYear);

      expect(component.selectedYear()).toBe(newYear);
      expect(mockEnergyMarketService.getMarketComparison).toHaveBeenCalledWith(newYear);
    });

    it('should get available years from combined data', () => {
      const years = component.availableYears;
      expect(years).toEqual([2024, 2023]); // Sorted descending
    });

    it('should return empty array when no combined data', () => {
      component.combinedData.set([]);
      const years = component.availableYears;
      expect(years).toEqual([]);
    });
  });

  describe('utility methods', () => {
    it('should track by year', () => {
      const item = { year: 2023 };
      const result = component.trackByYear(0, item);
      expect(result).toBe(2023);
    });

    it('should track by market', () => {
      const item = { market: 'IPEX' };
      const result = component.trackByMarket(0, item);
      expect(result).toBe('IPEX');
    });
  });

  describe('initial state', () => {
    it('should have correct initial selected year', () => {
      expect(component.selectedYear()).toBe(2020);
    });

    it('should start with empty data arrays', () => {
      expect(component.combinedData()).toEqual([]);
      expect(component.overlappingData()).toEqual([]);
      expect(component.highCvPrices()).toEqual([]);
      expect(component.marketComparison()).toEqual([]);
    });

    it('should start with no error and not loading', () => {
      expect(component.error()).toBe(null);
      expect(component.isLoading()).toBe(false);
    });
  });
});

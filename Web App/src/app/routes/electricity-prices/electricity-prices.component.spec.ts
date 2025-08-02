import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { provideZonelessChangeDetection } from '@angular/core';

import { ElectricityPricesComponent } from './electricity-prices.component';
import { EnergyMarketService } from '../../features/http/services/energy-market.service';
import { ElectricityPrice } from '../../features/http/models/energy-market.models';

describe('ElectricityPricesComponent', () => {
  let component: ElectricityPricesComponent;
  let fixture: ComponentFixture<ElectricityPricesComponent>;
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

  beforeEach(async () => {
    const energyMarketServiceSpy = jasmine.createSpyObj('EnergyMarketService', ['getElectricityPrices']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['get']);

    await TestBed.configureTestingModule({
      imports: [
        ElectricityPricesComponent
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: EnergyMarketService, useValue: energyMarketServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ElectricityPricesComponent);
    component = fixture.componentInstance;
    mockEnergyMarketService = TestBed.inject(EnergyMarketService) as jasmine.SpyObj<EnergyMarketService>;
    mockTranslateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;

    // Default mock implementations
    mockEnergyMarketService.getElectricityPrices.and.returnValue(of(mockElectricityPrices));
    mockTranslateService.get.and.returnValue(of({'APP.TITLE': 'Energy Market', 'ELECTRICITY_PRICES.TITLE': 'Electricity Prices'}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load electricity prices on init', () => {
      component.ngOnInit();

      expect(mockEnergyMarketService.getElectricityPrices).toHaveBeenCalled();
      expect(component.electricityPrices()).toEqual(mockElectricityPrices);
    });

    it('should set page title on init', () => {
      component.ngOnInit();

      expect(mockTranslateService.get).toHaveBeenCalledWith(['APP.TITLE', 'ELECTRICITY_PRICES.TITLE']);
    });

    it('should set loading state correctly', () => {
      component.ngOnInit();

      expect(component.isLoading()).toBe(false);
      expect(component.error()).toBe(null);
    });
  });

  describe('error handling', () => {
    it('should handle loading error', () => {
      const errorMessage = 'Network error';
      mockEnergyMarketService.getElectricityPrices.and.returnValue(throwError(() => errorMessage));
      spyOn(console, 'error');

      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith('Error loading electricity prices:', errorMessage);
      expect(component.error()).toBe('Failed to load electricity prices');
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('market columns', () => {
    it('should have correct market columns', () => {
      const expectedColumns = [
        { key: 'year', labelKey: 'ELECTRICITY_PRICES.YEAR' },
        { key: 'ipex', labelKey: 'ELECTRICITY_PRICES.IPEX' },
        { key: 'epex_germany', labelKey: 'ELECTRICITY_PRICES.EPEX_GERMANY' },
        { key: 'nord_pool', labelKey: 'ELECTRICITY_PRICES.NORD_POOL' },
        { key: 'omel', labelKey: 'ELECTRICITY_PRICES.OMEL' },
        { key: 'epex_france', labelKey: 'ELECTRICITY_PRICES.EPEX_FRANCE' }
      ];

      expect(component.marketColumns).toEqual(expectedColumns);
    });
  });

  describe('formatting methods', () => {
    it('should format price correctly', () => {
      const result = component.formatPrice(123.45);
      expect(result).toMatch(/123,45\s*€/);
    });

    it('should format price with zero decimal places correctly', () => {
      const result = component.formatPrice(100);
      expect(result).toMatch(/100,00\s*€/);
    });

    it('should format large price correctly', () => {
      const result = component.formatPrice(1234567.89);
      expect(result).toMatch(/1\.234\.567,89\s*€/);
    });
  });

  describe('utility methods', () => {
    it('should track by year', () => {
      const price: ElectricityPrice = {
        year: 2023,
        ipex: 150.5,
        epex_germany: 145.0,
        nord_pool: 148.0,
        omel: 152.0,
        epex_france: 155.0
      };

      const result = component.trackByYear(0, price);
      expect(result).toBe(2023);
    });
  });

  describe('initial state', () => {
    it('should start with empty data array', () => {
      expect(component.electricityPrices()).toEqual([]);
    });

    it('should start with no error and not loading', () => {
      expect(component.error()).toBe(null);
      expect(component.isLoading()).toBe(false);
    });
  });
});

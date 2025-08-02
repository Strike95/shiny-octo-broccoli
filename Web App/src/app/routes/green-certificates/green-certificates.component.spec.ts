import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { provideZonelessChangeDetection } from '@angular/core';

import { GreenCertificatesComponent } from './green-certificates.component';
import { EnergyMarketService } from '../../features/http/services/energy-market.service';
import { GreenCertificate } from '../../features/http/models/energy-market.models';

describe('GreenCertificatesComponent', () => {
  let component: GreenCertificatesComponent;
  let fixture: ComponentFixture<GreenCertificatesComponent>;
  let mockEnergyMarketService: jasmine.SpyObj<EnergyMarketService>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  const mockGreenCertificates: GreenCertificate[] = [
    {
      year: 2023,
      weighted_avg_price: 50.5,
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
    const energyMarketServiceSpy = jasmine.createSpyObj('EnergyMarketService', ['getGreenCertificates']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['get']);

    await TestBed.configureTestingModule({
      imports: [
        GreenCertificatesComponent
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: EnergyMarketService, useValue: energyMarketServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GreenCertificatesComponent);
    component = fixture.componentInstance;
    mockEnergyMarketService = TestBed.inject(EnergyMarketService) as jasmine.SpyObj<EnergyMarketService>;
    mockTranslateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;

    // Default mock implementations
    mockEnergyMarketService.getGreenCertificates.and.returnValue(of(mockGreenCertificates));
    mockTranslateService.get.and.returnValue(of({'APP.TITLE': 'Energy Market', 'GREEN_CERTIFICATES.TITLE': 'Green Certificates'}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load green certificates on init', () => {
      component.ngOnInit();

      expect(mockEnergyMarketService.getGreenCertificates).toHaveBeenCalled();
      expect(component.greenCertificates()).toEqual(mockGreenCertificates);
    });

    it('should set page title on init', () => {
      component.ngOnInit();

      expect(mockTranslateService.get).toHaveBeenCalledWith(['APP.TITLE', 'GREEN_CERTIFICATES.TITLE']);
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
      mockEnergyMarketService.getGreenCertificates.and.returnValue(throwError(() => errorMessage));
      spyOn(console, 'error');

      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith('Error loading green certificates:', errorMessage);
      expect(component.error()).toBe('Failed to load green certificates');
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('column definitions', () => {
    it('should have correct certificate columns', () => {
      const expectedColumns = [
        { key: 'year', labelKey: 'GREEN_CERTIFICATES.YEAR' },
        { key: 'weighted_avg_price', labelKey: 'GREEN_CERTIFICATES.WEIGHTED_AVG_PRICE' },
        { key: 'cvs_traded', labelKey: 'GREEN_CERTIFICATES.CVS_TRADED' },
        { key: 'total_value_incl_vat', labelKey: 'GREEN_CERTIFICATES.TOTAL_VALUE_INCL_VAT' }
      ];

      expect(component.certificateColumns).toEqual(expectedColumns);
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

    it('should format number correctly', () => {
      const result = component.formatNumber(123456);
      expect(result).toBe('123.456');
    });

    it('should format small number correctly', () => {
      const result = component.formatNumber(123);
      expect(result).toBe('123');
    });
  });

  describe('utility methods', () => {
    it('should track by year', () => {
      const certificate: GreenCertificate = {
        year: 2023,
        weighted_avg_price: 50.0,
        cvs_traded: 1000,
        total_value_incl_vat: 60000
      };

      const result = component.trackByYear(0, certificate);
      expect(result).toBe(2023);
    });
  });
});

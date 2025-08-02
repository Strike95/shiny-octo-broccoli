import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { EnergyMarketService } from './energy-market.service';
import { ElectricityPrice, GreenCertificate, MarketComparison, CombinedData } from '../models/energy-market.models';

describe('EnergyMarketService', () => {
  let service: EnergyMarketService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:3000/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        EnergyMarketService
      ]
    });
    service = TestBed.inject(EnergyMarketService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getElectricityPrices', () => {
    it('should fetch electricity prices', () => {
      const mockPrices: ElectricityPrice[] = [
        {
          year: 2023,
          ipex: 150.5,
          epex_germany: 145.2,
          nord_pool: 140.8,
          omel: 155.3,
          epex_france: 148.7
        },
        {
          year: 2022,
          ipex: 140.5,
          epex_germany: 135.2,
          nord_pool: 130.8,
          omel: 145.3,
          epex_france: 138.7
        }
      ];

      service.getElectricityPrices().subscribe(prices => {
        expect(prices).toEqual(mockPrices);
        expect(prices.length).toBe(2);
        expect(prices[0].year).toBe(2023);
      });

      const req = httpMock.expectOne(`${baseUrl}/electricity-prices`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPrices);
    });

    it('should handle empty electricity prices response', () => {
      const mockPrices: ElectricityPrice[] = [];

      service.getElectricityPrices().subscribe(prices => {
        expect(prices).toEqual([]);
        expect(prices.length).toBe(0);
      });

      const req = httpMock.expectOne(`${baseUrl}/electricity-prices`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPrices);
    });
  });

  describe('getGreenCertificates', () => {
    it('should fetch green certificates', () => {
      const mockCertificates: GreenCertificate[] = [
        {
          year: 2023,
          weighted_avg_price: 45.7,
          cvs_traded: 1000000,
          total_value_incl_vat: 55000000
        },
        {
          year: 2022,
          weighted_avg_price: 42.3,
          cvs_traded: 950000,
          total_value_incl_vat: 48000000
        }
      ];

      service.getGreenCertificates().subscribe(certificates => {
        expect(certificates).toEqual(mockCertificates);
        expect(certificates.length).toBe(2);
        expect(certificates[0].year).toBe(2023);
      });

      const req = httpMock.expectOne(`${baseUrl}/green-certificates`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCertificates);
    });

    it('should handle empty green certificates response', () => {
      const mockCertificates: GreenCertificate[] = [];

      service.getGreenCertificates().subscribe(certificates => {
        expect(certificates).toEqual([]);
        expect(certificates.length).toBe(0);
      });

      const req = httpMock.expectOne(`${baseUrl}/green-certificates`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCertificates);
    });
  });

  describe('getMarketComparison', () => {
    it('should fetch market comparison for specific year', () => {
      const year = 2023;
      const mockComparison: MarketComparison[] = [
        { market: 'IPEX', price: 150.5 },
        { market: 'EPEX Germany', price: 145.2 },
        { market: 'Nord Pool', price: 140.8 }
      ];

      service.getMarketComparison(year).subscribe(comparison => {
        expect(comparison).toEqual(mockComparison);
        expect(comparison.length).toBe(3);
        expect(comparison[0].market).toBe('IPEX');
      });

      const req = httpMock.expectOne(`${baseUrl}/market-comparison/${year}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockComparison);
    });

    it('should handle different years in market comparison', () => {
      const year = 2020;
      const mockComparison: MarketComparison[] = [
        { market: 'IPEX', price: 100.5 },
        { market: 'EPEX Germany', price: 95.2 }
      ];

      service.getMarketComparison(year).subscribe(comparison => {
        expect(comparison).toEqual(mockComparison);
        expect(comparison.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}/market-comparison/${year}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockComparison);
    });
  });

  describe('getCombinedData', () => {
    it('should fetch combined data', () => {
      const mockCombined: CombinedData[] = [
        {
          year: 2023,
          ipex: 150.5,
          epex_germany: 145.2,
          nord_pool: 140.8,
          omel: 155.3,
          epex_france: 148.7,
          cv_price: 45.7,
          cvs_traded: 1000000,
          total_value_incl_vat: 55000000
        }
      ];

      service.getCombinedData().subscribe(data => {
        expect(data).toEqual(mockCombined);
        expect(data.length).toBe(1);
        expect(data[0].year).toBe(2023);
      });

      const req = httpMock.expectOne(`${baseUrl}/combined-data`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCombined);
    });

    it('should handle combined data with null certificate values', () => {
      const mockCombined: CombinedData[] = [
        {
          year: 2020,
          ipex: 120.5,
          epex_germany: 115.2,
          nord_pool: 110.8,
          omel: 125.3,
          epex_france: 118.7,
          cv_price: null,
          cvs_traded: null,
          total_value_incl_vat: null
        }
      ];

      service.getCombinedData().subscribe(data => {
        expect(data).toEqual(mockCombined);
        expect(data[0].cv_price).toBeNull();
        expect(data[0].cvs_traded).toBeNull();
        expect(data[0].total_value_incl_vat).toBeNull();
      });

      const req = httpMock.expectOne(`${baseUrl}/combined-data`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCombined);
    });
  });

  describe('getOverlappingData', () => {
    it('should fetch overlapping data', () => {
      const mockData = [
        { year: 2022, ipex: 140.5, cv_price: 42.3 },
        { year: 2023, ipex: 150.5, cv_price: 45.7 }
      ];

      service.getOverlappingData().subscribe(data => {
        expect(data).toEqual(mockData);
        expect(data.length).toBe(2);
      });

      const req = httpMock.expectOne(`${baseUrl}/overlapping-data`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });

  describe('getHighCvPrices', () => {
    it('should fetch high CV prices', () => {
      const mockData = [
        { year: 2023, cv_price: 45.7, ipex: 150.5 }
      ];

      service.getHighCvPrices().subscribe(data => {
        expect(data).toEqual(mockData);
        expect(data.length).toBe(1);
      });

      const req = httpMock.expectOne(`${baseUrl}/high-cv-prices`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });

  describe('getHealthCheck', () => {
    it('should fetch health check status', () => {
      const mockHealth = { status: 'healthy', timestamp: new Date().toISOString() };

      service.getHealthCheck().subscribe(health => {
        expect(health).toEqual(mockHealth);
        expect(health.status).toBe('healthy');
      });

      const req = httpMock.expectOne(`${baseUrl}/health`);
      expect(req.request.method).toBe('GET');
      req.flush(mockHealth);
    });

    it('should handle unhealthy status', () => {
      const mockHealth = { status: 'unhealthy', error: 'Database connection failed' };

      service.getHealthCheck().subscribe(health => {
        expect(health).toEqual(mockHealth);
        expect(health.status).toBe('unhealthy');
        expect(health.error).toBe('Database connection failed');
      });

      const req = httpMock.expectOne(`${baseUrl}/health`);
      expect(req.request.method).toBe('GET');
      req.flush(mockHealth);
    });
  });
});

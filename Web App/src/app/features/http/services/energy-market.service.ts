import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ElectricityPrice, GreenCertificate, MarketComparison, CombinedData } from '../models/energy-market.models';

@Injectable({
  providedIn: 'root'
})
export class EnergyMarketService {
  private readonly _baseUrl = 'http://localhost:3000/api';

  constructor(private _httpClient: HttpClient) { }

  getElectricityPrices(): Observable<ElectricityPrice[]> {
    return this._httpClient.get<ElectricityPrice[]>(`${this._baseUrl}/electricity-prices`);
  }

  getGreenCertificates(): Observable<GreenCertificate[]> {
    return this._httpClient.get<GreenCertificate[]>(`${this._baseUrl}/green-certificates`);
  }

  getMarketComparison(year: number): Observable<MarketComparison[]> {
    return this._httpClient.get<MarketComparison[]>(`${this._baseUrl}/market-comparison/${year}`);
  }

  getCombinedData(): Observable<CombinedData[]> {
    return this._httpClient.get<CombinedData[]>(`${this._baseUrl}/combined-data`);
  }

  getOverlappingData(): Observable<any[]> {
    return this._httpClient.get<any[]>(`${this._baseUrl}/overlapping-data`);
  }

  getHighCvPrices(): Observable<any[]> {
    return this._httpClient.get<any[]>(`${this._baseUrl}/high-cv-prices`);
  }

  getHealthCheck(): Observable<any> {
    return this._httpClient.get<any>(`${this._baseUrl}/health`);
  }
}

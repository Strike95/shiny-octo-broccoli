import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EnergyMarketService } from '../../features/http/services/energy-market.service';
import { CombinedData } from '../../features/http/models/energy-market.models';

/**
 * Component per la pagina Market Analysis
 * Design choice: Standalone component con Bootstrap e accessibilità WCAG 2.2 AA
 */
@Component({
  selector: 'app-market-analysis',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './market-analysis.component.html',
  styleUrl: './market-analysis.component.scss'
})
export class MarketAnalysisComponent implements OnInit {
  private readonly _translateService = inject(TranslateService);
  private readonly _energyMarketService = inject(EnergyMarketService);

  // Signals for reactive data management
  public readonly combinedData = signal<CombinedData[]>([]);
  public readonly overlappingData = signal<any[]>([]);
  public readonly highCvPrices = signal<any[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);

  // Selected year for market comparison
  public readonly selectedYear = signal<number>(2020);
  public readonly marketComparison = signal<any[]>([]);

  public ngOnInit(): void {
    this._setPageTitle();
    this._loadAnalysisData();
  }

  private _setPageTitle(): void {
    this._translateService.get(['APP.TITLE', 'MARKET_ANALYSIS.TITLE']).subscribe(translations => {
      document.title = `${translations['MARKET_ANALYSIS.TITLE']} - ${translations['APP.TITLE']}`;
    });
  }

  private _loadAnalysisData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Load combined data
    this._energyMarketService.getCombinedData().subscribe({
      next: (data) => {
        this.combinedData.set(data);
        this._loadMarketComparison();
      },
      error: (err) => {
        console.error('Error loading combined data:', err);
        this.error.set('Failed to load market analysis data');
        this.isLoading.set(false);
      }
    });

    // Load overlapping data
    this._energyMarketService.getOverlappingData().subscribe({
      next: (data) => this.overlappingData.set(data),
      error: (err) => console.error('Error loading overlapping data:', err)
    });

    // Load high CV prices
    this._energyMarketService.getHighCvPrices().subscribe({
      next: (data) => this.highCvPrices.set(data),
      error: (err) => console.error('Error loading high CV prices:', err)
    });
  }

  private _loadMarketComparison(): void {
    this._energyMarketService.getMarketComparison(this.selectedYear()).subscribe({
      next: (data) => {
        this.marketComparison.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading market comparison:', err);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Format price values for display
   */
  public formatPrice(value: number | null): string {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  /**
   * Format large numbers with locale-specific formatting
   */
  public formatNumber(value: number | null): string {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('it-IT').format(value);
  }

  /**
   * Calculate correlation between electricity prices and CV prices
   */
  public get priceCorrelation(): number {
    const data = this.overlappingData();
    if (data.length < 2) return 0;

    const electricityPrices = data.map(d => d.ipex);
    const cvPrices = data.map(d => d.cv_price);
    
    const n = data.length;
    const sumX = electricityPrices.reduce((a, b) => a + b, 0);
    const sumY = cvPrices.reduce((a, b) => a + b, 0);
    const sumXY = electricityPrices.reduce((sum, x, i) => sum + x * cvPrices[i], 0);
    const sumXX = electricityPrices.reduce((sum, x) => sum + x * x, 0);
    const sumYY = cvPrices.reduce((sum, y) => sum + y * y, 0);

    const correlation = (n * sumXY - sumX * sumY) / 
                       Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    return isNaN(correlation) ? 0 : correlation;
  }

  /**
   * Change selected year for market comparison
   */
  public changeYear(year: number): void {
    this.selectedYear.set(year);
    this._loadMarketComparison();
  }

  /**
   * Get available years from combined data
   */
  public get availableYears(): number[] {
    return this.combinedData().map(d => d.year).sort((a, b) => b - a);
  }

  /**
   * Track by function for ngFor performance
   */
  public trackByYear(index: number, item: any): number {
    return item.year;
  }

  /**
   * Track by function for market comparison
   */
  public trackByMarket(index: number, item: any): string {
    return item.market;
  }
}

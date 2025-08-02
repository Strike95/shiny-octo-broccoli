import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EnergyMarketService } from '../../features/http/services/energy-market.service';
import { ElectricityPrice } from '../../features/http/models/energy-market.models';

/**
 * Component per la pagina Electricity Prices
 * Design choice: Standalone component con Bootstrap e accessibilità WCAG 2.2 AA
 */
@Component({
  selector: 'app-electricity-prices',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './electricity-prices.component.html',
  styleUrl: './electricity-prices.component.scss'
})
export class ElectricityPricesComponent implements OnInit {
  private readonly _translateService = inject(TranslateService);
  private readonly _energyMarketService = inject(EnergyMarketService);

  // Signals for reactive data management
  public readonly electricityPrices = signal<ElectricityPrice[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);

  // Market columns for display
  public readonly marketColumns = [
    { key: 'year', labelKey: 'ELECTRICITY_PRICES.YEAR' },
    { key: 'ipex', labelKey: 'ELECTRICITY_PRICES.IPEX' },
    { key: 'epex_germany', labelKey: 'ELECTRICITY_PRICES.EPEX_GERMANY' },
    { key: 'nord_pool', labelKey: 'ELECTRICITY_PRICES.NORD_POOL' },
    { key: 'omel', labelKey: 'ELECTRICITY_PRICES.OMEL' },
    { key: 'epex_france', labelKey: 'ELECTRICITY_PRICES.EPEX_FRANCE' }
  ];

  public ngOnInit(): void {
    this._setPageTitle();
    this._loadElectricityPrices();
  }

  private _setPageTitle(): void {
    this._translateService.get(['APP.TITLE', 'ELECTRICITY_PRICES.TITLE']).subscribe(translations => {
      document.title = `${translations['ELECTRICITY_PRICES.TITLE']} - ${translations['APP.TITLE']}`;
    });
  }

  private _loadElectricityPrices(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this._energyMarketService.getElectricityPrices().subscribe({
      next: (prices) => {
        this.electricityPrices.set(prices);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading electricity prices:', err);
        this.error.set('Failed to load electricity prices');
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Format price values for display
   */
  public formatPrice(value: number): string {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  /**
   * Track by function for ngFor performance
   */
  public trackByYear(index: number, item: ElectricityPrice): number {
    return item.year;
  }
}

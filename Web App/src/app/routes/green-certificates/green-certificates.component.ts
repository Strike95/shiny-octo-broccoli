import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EnergyMarketService } from '../../features/http/services/energy-market.service';
import { GreenCertificate } from '../../features/http/models/energy-market.models';

/**
 * Component per la pagina Green Certificates
 * Design choice: Standalone component con Bootstrap e accessibilità WCAG 2.2 AA
 */
@Component({
  selector: 'app-green-certificates',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './green-certificates.component.html',
  styleUrl: './green-certificates.component.scss'
})
export class GreenCertificatesComponent implements OnInit {
  private readonly _translateService = inject(TranslateService);
  private readonly _energyMarketService = inject(EnergyMarketService);

  // Signals for reactive data management
  public readonly greenCertificates = signal<GreenCertificate[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);

  // Column definitions for display
  public readonly certificateColumns = [
    { key: 'year', labelKey: 'GREEN_CERTIFICATES.YEAR' },
    { key: 'weighted_avg_price', labelKey: 'GREEN_CERTIFICATES.WEIGHTED_AVG_PRICE' },
    { key: 'cvs_traded', labelKey: 'GREEN_CERTIFICATES.CVS_TRADED' },
    { key: 'total_value_incl_vat', labelKey: 'GREEN_CERTIFICATES.TOTAL_VALUE_INCL_VAT' }
  ];

  public ngOnInit(): void {
    this._setPageTitle();
    this._loadGreenCertificates();
  }

  private _setPageTitle(): void {
    this._translateService.get(['APP.TITLE', 'GREEN_CERTIFICATES.TITLE']).subscribe(translations => {
      document.title = `${translations['GREEN_CERTIFICATES.TITLE']} - ${translations['APP.TITLE']}`;
    });
  }

  private _loadGreenCertificates(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this._energyMarketService.getGreenCertificates().subscribe({
      next: (certificates) => {
        this.greenCertificates.set(certificates);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading green certificates:', err);
        this.error.set('Failed to load green certificates');
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
   * Format large numbers with locale-specific formatting
   */
  public formatNumber(value: number): string {
    return new Intl.NumberFormat('it-IT').format(value);
  }

  /**
   * Track by function for ngFor performance
   */
  public trackByYear(index: number, item: GreenCertificate): number {
    return item.year;
  }
}

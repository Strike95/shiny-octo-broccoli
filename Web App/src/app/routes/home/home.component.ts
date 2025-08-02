import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EnergyMarketService } from '../../features/http/services/energy-market.service';
import { ElectricityPrice, GreenCertificate } from '../../features/http/models/energy-market.models';

/**
 * Component per la pagina Home
 * Design choice: Standalone component con Bootstrap design system
 * Implementa WCAG 2.2 AA attraverso:
 * - Struttura semantica con headings gerarchici
 * - ARIA landmarks e labels
 * - Supporto screen reader con contenuto descrittivo
 * - Responsive design mobile-first
 * - Alto contrasto e supporto per enlarged text
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly _translateService = inject(TranslateService);
  private readonly _energyMarketService = inject(EnergyMarketService);
  
  // Signals per i dati
  private readonly _electricityPrices = signal<ElectricityPrice[]>([]);
  private readonly _greenCertificates = signal<GreenCertificate[]>([]);
  private readonly _isLoading = signal<boolean>(true);
  private readonly _error = signal<string | null>(null);

  // Computed properties per le statistiche calcolate
  public readonly latestElectricityPrice = computed(() => {
    const prices = this._electricityPrices();
    if (prices.length === 0) return null;
    
    // Prendi il prezzo più recente (ultimo anno disponibile)
    const latest = prices[prices.length - 1];
    return latest ? latest.ipex : 0; // Usa IPEX come riferimento principale
  });

  public readonly averageElectricityPrice = computed(() => {
    const prices = this._electricityPrices();
    if (prices.length === 0) return 0;
    
    const sum = prices.reduce((acc, price) => acc + price.ipex, 0);
    return sum / prices.length;
  });

  public readonly totalGreenCertificates = computed(() => {
    const certificates = this._greenCertificates();
    if (certificates.length === 0) return 0;
    
    return certificates.reduce((acc, cert) => acc + cert.cvs_traded, 0);
  });

  public readonly certificatesGrowth = computed(() => {
    const certificates = this._greenCertificates();
    if (certificates.length < 2) return 0;
    
    const recent = certificates[certificates.length - 1];
    const previous = certificates[certificates.length - 2];
    
    if (!recent || !previous || previous.cvs_traded === 0) return 0;
    
    return ((recent.cvs_traded - previous.cvs_traded) / previous.cvs_traded) * 100;
  });

  private readonly _formatGrowthValue = computed(() => {
    const growth = this.certificatesGrowth();
    if (growth === 0) return 'Loading...';
    const sign = growth > 0 ? '+' : '';
    return `${sign}${growth.toFixed(1)}%`;
  });

  // Summary statistics per le card informative
  public readonly summaryStats = computed(() => {
    const prices = this._electricityPrices();
    const certificates = this._greenCertificates();
    
    return {
      totalYearsElectricity: prices.length,
      totalYearsCertificates: certificates.length,
      avgElectricityPrice: this.averageElectricityPrice(),
      maxElectricityPrice: prices.length > 0 ? Math.max(...prices.map(p => p.ipex)) : 0,
      totalCertificatesValue: certificates.reduce((sum, cert) => sum + cert.total_value_incl_vat, 0)
    };
  });

  public readonly isLoading = this._isLoading.asReadonly();
  public readonly error = this._error.asReadonly();

  /**
   * Dati per le statistiche rapide con valori calcolati
   * Design choice: Array tipizzato per consistenza e manutenibilità
   */
  public readonly quickStats = computed(() => [
    {
      id: 'prices',
      title: 'ELECTRICITY_PRICES.TITLE',
      description: 'HOME.STATS.ELECTRICITY_DESCRIPTION',
      value: this.latestElectricityPrice() ? `€${this.latestElectricityPrice()?.toFixed(2)}/MWh` : 'Loading...',
      icon: 'bi bi-graph-up'
    },
    {
      id: 'certificates',
      title: 'GREEN_CERTIFICATES.TITLE', 
      description: 'HOME.STATS.CERTIFICATES_DESCRIPTION',
      value: this.totalGreenCertificates() > 0 ? this.totalGreenCertificates().toLocaleString() : 'Loading...',
      icon: 'bi bi-award'
    },
    {
      id: 'analysis',
      title: 'MARKET_ANALYSIS.TITLE',
      description: 'HOME.STATS.ANALYSIS_DESCRIPTION',
      value: this._formatGrowthValue(),
      icon: 'bi bi-bar-chart'
    }
  ]);

  /**
   * Dati per le features principali
   * Design choice: Struttura tipizzata per garantire consistenza
   */
  public readonly features = [
    {
      id: 'electricity',
      title: 'HOME.FEATURES.ELECTRICITY.TITLE',
      description: 'HOME.FEATURES.ELECTRICITY.DESCRIPTION',
      route: '/electricity-prices',
      icon: 'bi bi-lightning-charge-fill'
    },
    {
      id: 'certificates',
      title: 'HOME.FEATURES.CERTIFICATES.TITLE',
      description: 'HOME.FEATURES.CERTIFICATES.DESCRIPTION',
      route: '/green-certificates',
      icon: 'bi bi-award-fill'
    },
    {
      id: 'analysis',
      title: 'HOME.FEATURES.ANALYSIS.TITLE',
      description: 'HOME.FEATURES.ANALYSIS.DESCRIPTION',
      route: '/market-analysis',
      icon: 'bi bi-graph-up-arrow'
    }
  ] as const;

  public ngOnInit(): void {
    // Imposta il title della pagina per SEO e accessibilità
    this._setPageTitle();
    
    // Carica i dati per le statistiche
    this._loadMarketData();
  }

  /**
   * Carica i dati di mercato per calcolare le statistiche
   */
  private _loadMarketData(): void {
    this._isLoading.set(true);
    this._error.set(null);

    let electricityLoaded = false;
    let certificatesLoaded = false;

    const checkComplete = () => {
      if (electricityLoaded && certificatesLoaded) {
        this._isLoading.set(false);
      }
    };

    // Carica i prezzi dell'elettricità
    this._energyMarketService.getElectricityPrices().subscribe({
      next: (prices) => {
        this._electricityPrices.set(prices);
        electricityLoaded = true;
        checkComplete();
      },
      error: (error) => {
        console.error('Error loading electricity prices:', error);
        this._error.set('Failed to load electricity prices');
        electricityLoaded = true;
        checkComplete();
      }
    });

    // Carica i certificati verdi
    this._energyMarketService.getGreenCertificates().subscribe({
      next: (certificates) => {
        this._greenCertificates.set(certificates);
        certificatesLoaded = true;
        checkComplete();
      },
      error: (error) => {
        console.error('Error loading green certificates:', error);
        if (!this._error()) { // Solo se non c'è già un errore
          this._error.set('Failed to load green certificates');  
        }
        certificatesLoaded = true;
        checkComplete();
      }
    });
  }

  /**
   * TrackBy function per ottimizzazione performance ngFor
   */
  public trackByStatId(index: number, stat: any): string {
    return stat.id;
  }

  /**
   * TrackBy function per features
   */
  public trackByFeatureId(index: number, feature: any): string {
    return feature.id;
  }

  /**
   * Scroll smooth alla sezione features
   * Design choice: Smooth scroll per UX migliorata con fallback accessibilità
   */
  public scrollToFeatures(): void {
    const featuresElement = document.getElementById('features');
    if (featuresElement) {
      featuresElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Imposta focus per accessibilità keyboard
      setTimeout(() => {
        const featuresTitle = document.getElementById('features-title');
        featuresTitle?.focus();
      }, 500);
    }
  }

  /**
   * Genera aria-label per il pulsante Get Started
   * Design choice: Metodo dedicato per gestire concatenazione traduzioni
   */
  public getStartedAriaLabel(): string {
    return this._translateService.instant('HOME.GET_STARTED_ARIA');
  }

  /**
   * Genera aria-label dinamico per i feature links
   * Design choice: Accessibilità migliorata con descrizioni specifiche
   */
  public getFeatureAriaLabel(feature: any): string {
    const title = this._translateService.instant(feature.title);
    return `Explore ${title}`;
  }

  /**
   * Imposta il title della pagina
   * Design choice: SEO e accessibilità attraverso title dinamico
   */
  private _setPageTitle(): void {
    this._translateService.get(['APP.TITLE', 'HOME.TITLE']).subscribe(translations => {
      document.title = `${translations['HOME.TITLE']} - ${translations['APP.TITLE']}`;
    });
  }
}

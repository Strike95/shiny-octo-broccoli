import { Routes } from '@angular/router';

/**
 * Configurazione routing dell'applicazione
 * Design choice: Lazy loading per ottimizzazione performance
 * Struttura organizzata sotto /routes per chiarezza architetturale
 */
export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./routes/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'electricity-prices', 
    loadComponent: () => import('./routes/electricity-prices/electricity-prices.component').then(m => m.ElectricityPricesComponent) 
  },
  { 
    path: 'green-certificates', 
    loadComponent: () => import('./routes/green-certificates/green-certificates.component').then(m => m.GreenCertificatesComponent) 
  },
  { 
    path: 'market-analysis', 
    loadComponent: () => import('./routes/market-analysis/market-analysis.component').then(m => m.MarketAnalysisComponent) 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];

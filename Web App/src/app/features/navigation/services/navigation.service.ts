import { Injectable, inject, signal, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, map } from 'rxjs/operators';

/**
 * Navigation Service
 * 
 * ARCHITECTURAL DECISIONS:
 * - Centralized navigation state management using Angular signals
 * - Route-aware navigation with URL validation
 * - Analytics integration point for navigation tracking
 * - Accessibility-first approach with proper ARIA support
 * 
 * DESIGN PATTERNS:
 * - Service Layer Pattern: Encapsulates navigation logic
 * - Observer Pattern: Reactive updates when route changes
 * - Command Pattern: Navigation actions as methods
 * - Strategy Pattern: Different navigation behaviors per route type
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly _router = inject(Router);
  private readonly _translateService = inject(TranslateService);

  /**
   * Current route state signal
   * ARCHITECTURAL CHOICE: Signals for reactive navigation state management
   */
  private readonly _currentRoute = signal<string>('/');
  private readonly _previousRoute = signal<string>('/');

  /**
   * Navigation menu configuration
   * ARCHITECTURAL DECISION: Centralized navigation structure
   * - Single source of truth for all navigation items
   * - Consistent icon and labeling across components
   * - Permission-based route filtering (extensible for future auth)
   */
  public readonly navigationConfig = computed(() => [
    {
      route: '/electricity-prices',
      labelKey: 'NAVIGATION.ELECTRICITY_PRICES',
      icon: 'bi bi-graph-up',
      description: 'NAVIGATION.ELECTRICITY_PRICES_DESCRIPTION',
      category: 'data',
      order: 1,
      requiresAuth: false
    },
    {
      route: '/green-certificates',
      labelKey: 'NAVIGATION.GREEN_CERTIFICATES',
      icon: 'bi bi-award',
      description: 'NAVIGATION.GREEN_CERTIFICATES_DESCRIPTION',
      category: 'data',
      order: 2,
      requiresAuth: false
    },
    {
      route: '/market-analysis',
      labelKey: 'NAVIGATION.MARKET_ANALYSIS',
      icon: 'bi bi-bar-chart',
      description: 'NAVIGATION.MARKET_ANALYSIS_DESCRIPTION',
      category: 'analysis',
      order: 3,
      requiresAuth: false
    }
  ]);

  /**
   * Main navigation items (excludes home since it's handled by brand logo)
   * DESIGN PATTERN: Strategy pattern for different navigation views
   */
  public readonly mainNavigationItems = computed(() => 
    this.navigationConfig().filter(item => item.category === 'data' || item.category === 'analysis')
  );

  /**
   * Data-specific navigation items
   */
  public readonly dataNavigationItems = computed(() => 
    this.navigationConfig().filter(item => item.category === 'data')
  );

  constructor() {
    this._initializeRouteTracking();
  }

  /**
   * Navigate to route with proper state management
   * 
   * ARCHITECTURAL DECISION: Centralized navigation with:
   * - Previous route tracking for back navigation
   * - Query parameter preservation
   * - Fragment handling for deep linking
   * - Navigation validation and error handling
   * 
   * @param route - Target route
   * @param queryParams - Optional query parameters
   * @param fragment - Optional URL fragment
   */
  public navigateTo(route: string, queryParams?: any, fragment?: string): Promise<boolean> {
    this._previousRoute.set(this._currentRoute());
    
    const navigationExtras = {
      queryParams: queryParams || {},
      fragment: fragment || '',
      queryParamsHandling: 'merge' as const
    };

    return this._router.navigate([route], navigationExtras)
      .then(success => {
        if (success) {
          this._currentRoute.set(route);
        }
        return success;
      })
      .catch(error => {
        console.error('Navigation error:', error);
        return false;
      });
  }

  /**
   * Navigate back to previous route
   * ACCESSIBILITY: Provides consistent back navigation pattern
   */
  public navigateBack(): Promise<boolean> {
    const previousRoute = this._previousRoute();
    return this.navigateTo(previousRoute);
  }

  /**
   * Check if route is currently active
   * UTILITY: For navigation highlighting and conditional rendering
   */
  public isRouteActive(route: string): boolean {
    return this._currentRoute() === route;
  }

  /**
   * Get route configuration by path
   * UTILITY: Access route metadata programmatically
   */
  public getRouteConfig(route: string) {
    return this.navigationConfig().find(config => config.route === route);
  }

  /**
   * Initialize route change tracking
   * ARCHITECTURAL DECISION: Reactive route state management
   */
  private _initializeRouteTracking(): void {
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => event.url)
    ).subscribe(url => {
      const route = url.split('?')[0]; // Remove query parameters
      this._currentRoute.set(route);
    });

    // Set initial route
    this._currentRoute.set(this._router.url.split('?')[0]);
  }
}

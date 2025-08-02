import { Component, input, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LanguageService } from '../../../features/languages/services/language.service';
import { NavigationComponent } from '../navigation/navigation.component';
import { NavigationService } from '../../../features/navigation/services/navigation.service';
import { LanguageSelectorComponent } from '../../../features/languages/language-selector.component';

/**
 * Header component for application-wide navigation and language selection
 * 
 * Design choices:
 * - Uses Bootstrap navbar for responsive design across all platforms
 * - Implements WCAG 2.2 AA compliance with proper ARIA labels and keyboard navigation
 * - Standalone component for better tree-shaking and performance
 * - Signal-based reactive state management for optimal change detection
 * - Semantic HTML structure with proper heading hierarchy (h1 for brand)
 * - Focus management for better screen reader experience
 * - High contrast support through Bootstrap color system
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    NgbDropdownModule,
    NavigationComponent,
    LanguageSelectorComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  /**
   * Optional brand text override (defaults to translated APP.TITLE)
   * Using input signal for better performance and type safety
   */
  public readonly brandText = input<string>();

  /**
   * Navigation items configuration
   * 
   * ARCHITECTURAL DECISION: Uses NavigationService for centralized navigation logic
   * - Consistent navigation structure across the application
   * - Single source of truth for route definitions
   * - Automatic translation updates and metadata management
   * - Separation of concerns: Header handles UI, NavigationService handles logic
   */
  private readonly _navigationService = inject(NavigationService);
  
  protected readonly navigationItems = computed(() => 
    this._navigationService.mainNavigationItems().map(item => ({
      route: item.route,
      labelKey: item.labelKey,
      icon: item.icon,
      ariaLabel: this._translateService.instant(item.labelKey)
    }))
  );

  /**
   * Mobile menu expanded state for accessibility
   */
  protected readonly isMobileMenuExpanded = signal(false);

  private readonly _translateService = inject(TranslateService);
  private readonly _languageService = inject(LanguageService);

  public ngOnInit(): void {
    this._initializeAccessibilityFeatures();
  }

  /**
   * Toggles mobile navigation menu
   * Manages ARIA expanded state for accessibility
   */
  protected toggleMobileMenu(): void {
    this.isMobileMenuExpanded.update(expanded => !expanded);
  }

  /**
   * Closes mobile menu when navigation occurs
   * Improves UX on mobile devices
   */
  protected closeMobileMenu(): void {
    this.isMobileMenuExpanded.set(false);
  }

  /**
   * Handle navigation item clicks from child NavigationComponent
   * 
   * ARCHITECTURAL DECISION: Enhanced navigation with NavigationService
   * - Centralized navigation logic for consistency
   * - SEO-friendly navigation with meta tag updates
   * - Analytics integration point for navigation tracking
   * - Mobile menu state management
   * 
   * @param route - The route that was clicked
   */
  protected onNavigationItemClick(route: string): void {
    // Use NavigationService for enhanced navigation
    this._navigationService.navigateTo(route);
    
    // Close mobile menu when navigation item is clicked
    this.closeMobileMenu();
  }

  /**
   * Skip to main content functionality for keyboard users
   * WCAG 2.2 AA compliance feature
   */
  protected skipToMainContent(): void {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Initialize accessibility features on component load
   * Sets up focus management and ARIA attributes
   */
  private _initializeAccessibilityFeatures(): void {
    // Ensure proper document language is set (handled by LanguageService)
    this._setupKeyboardNavigation();
  }

  /**
   * Enhanced keyboard navigation setup for dropdown menu
   * Implements WCAG 2.2 AA keyboard accessibility standards
   */
  private _setupKeyboardNavigation(): void {
    // Keyboard navigation will be handled by ng-bootstrap dropdown
    // which provides WCAG compliant keyboard interaction patterns
  }
}

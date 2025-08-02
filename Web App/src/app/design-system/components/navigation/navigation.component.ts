import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Navigation Component
 * 
 * ARCHITECTURAL DECISIONS:
 * - Standalone component for better tree-shaking and modularity
 * - Uses Angular signals for reactive state management
 * - Input/Output pattern for parent-child communication
 * - Separates navigation logic from header layout concerns
 * - WCAG 2.2 AA compliant with proper ARIA landmarks and keyboard navigation
 * - Mobile-first responsive design with Bootstrap classes
 * 
 * DESIGN PATTERNS:
 * - Smart/Dumb component pattern (this is a dumb/presentational component)
 * - Single Responsibility Principle - only handles navigation rendering
 * - Composition over inheritance - used within header component
 */
@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  /**
   * Navigation items input - allows parent to define routes
   * ARCHITECTURAL DECISION: Input pattern allows for flexible route configuration
   */
  public readonly navigationItems = input.required<Array<{
    route: string;
    labelKey: string;
    icon: string;
    ariaLabel?: string;
  }>>();

  /**
   * Mobile menu state input - controlled by parent component
   * ARCHITECTURAL DECISION: State management remains in parent (header) component
   */
  public readonly isMobileMenuExpanded = input<boolean>(false);

  /**
   * Navigation item click event output
   * ARCHITECTURAL DECISION: Allows parent to handle navigation events if needed
   */
  public readonly navigationItemClicked = output<string>();

  /**
   * Handle navigation item click
   * DESIGN PATTERN: Event delegation to parent component
   */
  public onNavigationItemClick(route: string): void {
    this.navigationItemClicked.emit(route);
  }
}

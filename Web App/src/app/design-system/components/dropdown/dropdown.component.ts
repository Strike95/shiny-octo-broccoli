import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

/**
 * Dropdown Component
 * 
 * ARCHITECTURAL DECISIONS:
 * - Reusable dropdown component following Design System principles
 * - Generic type support for flexible data handling
 * - WCAG 2.2 AA compliant with proper ARIA attributes
 * - Customizable appearance through input properties
 * - Event-driven architecture with output events
 * 
 * DESIGN PATTERNS:
 * - Template Pattern: Consistent dropdown structure with customizable content
 * - Strategy Pattern: Different display modes through configuration
 * - Observer Pattern: Event emission for parent-child communication
 */
@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent<T = any> {
  /**
   * Dropdown button text
   */
  public readonly buttonText = input<string>('');

  /**
   * Dropdown button CSS classes
   */
  public readonly buttonClass = input<string>('btn btn-outline-primary');

  /**
   * Dropdown placement
   */
  public readonly placement = input<string>('bottom-end');

  /**
   * ARIA label for accessibility
   */
  public readonly ariaLabel = input<string>('');

  /**
   * Items to display in dropdown
   */
  public readonly items = input.required<T[]>();

  /**
   * Function to get display text for each item
   */
  public readonly getItemText = input.required<(item: T) => string>();

  /**
   * Function to get unique key for each item (for tracking)
   */
  public readonly getItemKey = input.required<(item: T) => string | number>();

  /**
   * Function to check if item is active/selected
   */
  public readonly isItemActive = input<(item: T) => boolean>(() => false);

  /**
   * Show icons for items
   */
  public readonly showIcons = input<boolean>(false);

  /**
   * Function to get icon for each item
   */
  public readonly getItemIcon = input<(item: T) => string>(() => '');

  /**
   * Show active indicator (checkmark)
   */
  public readonly showActiveIndicator = input<boolean>(true);

  /**
   * Custom button content (overrides buttonText)
   */
  public readonly customButtonContent = input<boolean>(false);

  /**
   * Dropdown is disabled
   */
  public readonly disabled = input<boolean>(false);

  /**
   * Event emitted when item is selected
   */
  public readonly itemSelected = output<T>();

  /**
   * Event emitted when dropdown is opened
   */
  public readonly dropdownOpened = output<void>();

  /**
   * Event emitted when dropdown is closed
   */
  public readonly dropdownClosed = output<void>();

  /**
   * Unique dropdown ID for ARIA attributes
   */
  protected readonly dropdownId = computed(() => 
    'dropdown-' + Math.random().toString(36).substring(2, 9)
  );

  /**
   * Internal state for dropdown open/close
   */
  protected readonly isOpen = signal<boolean>(false);

  /**
   * Computed property for button classes
   */
  protected readonly computedButtonClass = computed(() => {
    const baseClass = this.buttonClass();
    const disabledClass = this.disabled() ? ' disabled' : '';
    return `${baseClass}${disabledClass}`;
  });

  /**
   * Handle item selection
   * 
   * ARCHITECTURAL DECISION: Event delegation pattern
   * - Emits event to parent for handling
   * - Maintains separation of concerns
   * - Allows for custom item selection logic
   */
  protected onItemSelect(item: T): void {
    if (!this.disabled()) {
      this.itemSelected.emit(item);
      this.closeDropdown();
    }
  }

  /**
   * Handle dropdown open
   */
  protected onDropdownOpen(): void {
    this.isOpen.set(true);
    this.dropdownOpened.emit();
  }

  /**
   * Handle dropdown close
   */
  protected onDropdownClose(): void {
    this.isOpen.set(false);
    this.dropdownClosed.emit();
  }

  /**
   * Programmatically close dropdown
   */
  public closeDropdown(): void {
    this.isOpen.set(false);
  }

  /**
   * Programmatically open dropdown
   */
  public openDropdown(): void {
    if (!this.disabled()) {
      this.isOpen.set(true);
    }
  }
}

/**
 * Vaccination state interface definition
 * 
 * DESIGN CHOICE: Using "I" prefix (IVaccinationState) following Microsoft TypeScript conventions.
 * This prefix clearly distinguishes interfaces from classes and concrete implementations,
 * making the codebase more readable and following established TypeScript patterns.
 * 
 * The interface defines the contract for vaccination state management, ensuring
 * that any implementing class provides all required properties and methods.
 */

export interface IVaccinationState {
  // State properties - readonly to enforce immutability
  readonly waitingChihuahuas: number;
  readonly waitingCats: number;
  readonly recoveryChihuahuas: number;
  readonly recoveryCats: number;
  readonly vaccinatedChihuahuas: number;
  readonly vaccinatedCats: number;

  // Computed properties exposed as getters for better encapsulation
  readonly isValid: boolean;
  readonly isGoal: boolean;
  readonly key: string;
  readonly nextStates: StateTransitionResult[];
  
  // Methods
  toString(): string;
}

/**
 * State transition result interface definition
 * 
 * DESIGN CHOICE: Keeping this interface in the same file as IVaccinationState
 * due to circular dependency. StateTransitionResult references IVaccinationState,
 * and IVaccinationState references StateTransitionResult in the nextStates property.
 * 
 * This co-location pattern is acceptable when interfaces are tightly coupled
 * and separating them would require complex import hierarchies.
 */
export interface StateTransitionResult {
  state: IVaccinationState;
  action: string;
}

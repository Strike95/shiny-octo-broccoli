/**
 * Vaccination move interface definition
 * 
 * DESIGN CHOICE: Data structure interface for move representation
 * 
 * REASONING FOR INTERFACE:
 * 1. Structured Data: Represents a complex data structure with multiple
 *    related properties that should be grouped together
 * 2. Type Safety: Ensures all move operations have consistent structure
 * 3. Documentation: The interface serves as living documentation of
 *    what constitutes a valid vaccination move
 * 4. Validation: Can be used with type guards for runtime validation
 * 
 * ALTERNATIVE CONSIDERED: Could be a type alias for a plain object,
 * but interface provides better IDE support and clearer intent.
 */

export interface VaccinationMove {
  chihuahuasToVaccinate: number;
  catsToVaccinate: number;
  chihuahuasToWaiting: number;
  catsToWaiting: number;
}

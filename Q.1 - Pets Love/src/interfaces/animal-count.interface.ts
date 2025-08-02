/**
 * Animal count interface definition
 * 
 * DESIGN CHOICE: Simple data structure interface without "I" prefix
 * 
 * REASONING:
 * 1. Data Transfer Object (DTO): This interface represents a simple data structure
 *    rather than a behavioral contract, so the "I" prefix is less critical
 * 2. Domain Model: Represents a core domain concept (counting animals)
 * 3. Structural Typing: TypeScript's structural typing makes this work naturally
 *    with any object that has these properties
 * 
 * However, for consistency with project standards, could be renamed to IAnimalCount.
 */

export interface AnimalCount {
  chihuahuas: number;
  cats: number;
}

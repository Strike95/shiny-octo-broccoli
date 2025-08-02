/**
 * Solution step interface definition
 * 
 * DESIGN CHOICE: Interface for solution step representation
 * 
 * REASONING FOR INTERFACE:
 * 1. Composite Structure: Combines state and action into a cohesive unit
 * 2. Algorithm Contract: Essential part of the search algorithm's return type
 * 3. Extensibility: Interface allows for easy extension if additional
 *    metadata is needed (e.g., cost, heuristic values)
 * 4. Type Safety: Ensures consistent structure across the solution path
 * 
 * PATTERN: Command Pattern influence - each step encapsulates both
 * the result state and the action that led to it.
 */

import { IVaccinationState } from './vaccination-state.interface';

export interface SolutionStep {
  state: IVaccinationState;
  action: string;
}

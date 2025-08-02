/**
 * Solution path type definition
 * 
 * DESIGN CHOICE: Using 'type' instead of 'interface'
 * 
 * REASONING FOR TYPE ALIAS:
 * 1. Union Type: This represents "SolutionStep[] OR null" - a union type
 *    that interfaces cannot express directly
 * 2. Semantic Meaning: This is a type alias for an existing combination
 *    of types, not a new structural contract
 * 3. Simplicity: Type aliases are more appropriate for simple combinations
 *    and transformations of existing types
 * 4. No Extension: We don't need to extend or implement this - it's purely
 *    a convenience alias for better readability
 * 
 * WHEN TO USE 'type' vs 'interface':
 * - Use 'type' for: unions, intersections, primitives, computed types
 * - Use 'interface' for: object shapes, contracts, extensible structures
 */

import { SolutionStep } from '../interfaces/solution-step.interface';

export type SolutionPath = SolutionStep[] | null;

import { SolutionStep } from './solution-step.interface';

/**
 * Interface for solving the vaccination transportation problem
 * 
 * DESIGN CHOICE: Using "I" prefix (ISolver) following TypeScript conventions.
 * This interface defines the contract for any solving algorithm, enabling
 * the Strategy pattern - different solving algorithms (DFS, BFS, A*) can
 * implement this interface while maintaining the same public API.
 * 
 * PATTERN EXPLANATION: Interface Segregation Principle
 * This interface is intentionally minimal, containing only the essential
 * methods required for solving. This makes it easy to implement and test.
 */
export interface ISolver {
  /**
   * Attempts to find a solution path from the predefined initial state
   * 
   * DESIGN CHOICE: No parameters required - the solver manages its own
   * initial state internally, simplifying the client interface.
   * 
   * @returns Array of solution steps if solution exists, null otherwise
   */
  solve(): SolutionStep[] | null;

  /**
   * Gets search statistics for analysis (readonly getter)
   * 
   * DESIGN CHOICE: Using getter pattern instead of method
   * Getters are appropriate here because:
   * 1. This is a simple property access (no complex computation)
   * 2. No parameters are needed
   * 3. The result is deterministic based on current state
   * 4. Maintains consistency with class property access patterns
   * 
   * @returns Object containing search metrics
   */
  readonly searchStats: { visitedStates: number };
}

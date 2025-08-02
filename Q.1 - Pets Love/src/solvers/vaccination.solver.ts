import { ISolver } from '../interfaces/solver.interface';
import { SolutionStep } from '../interfaces/solution-step.interface';
import { VaccinationState } from '../models/vaccination.state';
import { APP_CONFIG } from '../constants/app-config.constants';

/**
 * Solver for the pets vaccination problem using depth-first search with memoization
 * 
 * Algorithm Overview:
 * 1. Start with initial state (all animals in waiting room)
 * 2. For each state, generate all possible valid moves
 * 3. Use depth-first search to explore the state space
 * 4. Use memoization to avoid revisiting identical states
 * 5. Return the first solution found
 * 
 * Time Complexity: O(b^d) where b is branching factor, d is solution depth
 * Space Complexity: O(s) where s is the number of unique states
 */
export class VaccinationSolver implements ISolver {
  private readonly _visited: Set<string> = new Set<string>();

  /**
   * Returns search statistics for analysis
   * 
   * @returns Object containing search metrics
   */
  public get searchStats(): { visitedStates: number } {
    return {
      visitedStates: this._visited.size
    };
  }

  /**
   * Solves the vaccination problem and returns the solution path
   * 
   * @returns Array of solution steps if solution exists, null otherwise
   */
  public solve(): SolutionStep[] | null {
    // Reset solver state for fresh search
    this._visited.clear();
    
    // Create initial state: all animals in waiting room
    const initialState = new VaccinationState(
      APP_CONFIG.INITIAL_CHIHUAHUAS, 
      APP_CONFIG.INITIAL_CATS, 
      0, 0, 0, 0
    );
    
    return this._depthFirstSearch(initialState, []);
  }

  /**
   * Recursive depth-first search implementation
   * 
   * Search Strategy:
   * 1. Check if current state is the goal
   * 2. Check if state was already visited (memoization)
   * 3. Mark current state as visited
   * 4. Explore all valid next states recursively
   * 5. Backtrack if no solution found in current branch
   * 
   * @param state - Current state to explore
   * @param path - Path of steps taken to reach current state
   * @returns Solution path if found, null otherwise
   */
  private _depthFirstSearch(state: VaccinationState, path: SolutionStep[]): SolutionStep[] | null {
    // Base case: Check if we have reached the goal state
    if (state.isGoal) {
      return path;
    }

    // Memoization: Check if this state has already been explored
    const stateKey = state.key;
    if (this._visited.has(stateKey)) {
      return null;
    }

    // Mark this state as visited to prevent cycles
    this._visited.add(stateKey);

    // Explore all possible next states (breadth of search tree)
    const nextStates = state.nextStates;
    for (const { state: nextState, action } of nextStates) {
      // Create new path with current action
      const newPath = [...path, { state: nextState, action }];
      
      // Recursively search from next state
      const solution = this._depthFirstSearch(nextState, newPath);
      
      // If solution found in this branch, return it immediately
      if (solution) {
        return solution;
      }
    }

    // No solution found in any branch from this state
    return null;
  }
}

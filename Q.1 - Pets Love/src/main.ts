import { VaccinationSolver } from './solvers/vaccination.solver';
import { OutputFormatter } from './utils/output.formatter';

/**
 * Main application class for the pets vaccination problem solver
 * 
 * Orchestrates the solving process by:
 * 1. Displaying problem description and rules
 * 2. Executing the search algorithm
 * 3. Presenting the solution and statistics
 * 4. Handling errors gracefully
 */
class PetsVaccinationApp {
  private readonly _solver: VaccinationSolver;

  constructor() {
    this._solver = new VaccinationSolver();
  }

  /**
   * Executes the complete application workflow
   * 
   * Workflow:
   * 1. Display problem header and rules
   * 2. Execute the solving algorithm
   * 3. Display solution or error message
   * 4. Show search statistics for analysis
   */
  public run(): void {
    try {
      // Display problem introduction
      OutputFormatter.printHeader();
      OutputFormatter.printRules();

      // Execute the depth-first search algorithm
      const solution = this._solver.solve();
      
      // Display results
      OutputFormatter.printSolution(solution);
      
      // Display search statistics for performance analysis
      if (solution) {
        const searchStats = this._solver.searchStats;
        OutputFormatter.printStats(searchStats, solution.length);
        OutputFormatter.printSuccess('Application completed successfully!');
      }
      
    } catch (error) {
      OutputFormatter.printError(`Unexpected error during execution: ${error}`);
      process.exit(1);
    }
  }
}

/**
 * Application entry point
 * 
 * Creates and runs the pets vaccination solver application
 */
function main(): void {
  const app = new PetsVaccinationApp();
  app.run();
}

// Execute main function if this module is run directly (not imported)
if (require.main === module) {
  main();
}

import { SolutionStep } from '../interfaces/solution-step.interface';
import { VaccinationState } from '../models/vaccinationState.model.';
import { APP_CONFIG } from '../constants/app-config.constants';
import { LOG_PREFIXES } from '../constants/log-prefixes.constants';
import { UI_ELEMENTS } from '../constants/ui-elements.constants';

/**
 * Utility class for formatting and displaying output
 * 
 * Handles all console output including:
 * - Application header and rules
 * - Solution display with step-by-step breakdown
 * - Search statistics
 * - Error and success messages
 */
export class OutputFormatter {
  
  /**
   * Displays the application header with problem description
   */
  public static printHeader(): void {
    console.log(UI_ELEMENTS.TITLE);
    console.log(UI_ELEMENTS.SEPARATOR);
    console.log(`Initial state: ${APP_CONFIG.INITIAL_CHIHUAHUAS} Chihuahuas and ${APP_CONFIG.INITIAL_CATS} cats in waiting room`);
    console.log('Goal: Vaccinate all animals safely without attacks');
    console.log();
  }

  /**
   * Displays the game rules and constraints
   */
  public static printRules(): void {
    console.log('Game Rules:');
    console.log(`• Only ${APP_CONFIG.MAX_SURGERY_CAPACITY} animals can go to surgery at the same time`);
    console.log('• After vaccination: 1 returns to waiting room, 1 goes to recovery room');
    console.log('• Chihuahuas attack cats if they outnumber cats in any room');
    console.log('• All animals must be vaccinated before going home');
    console.log();
  }

  /**
   * Displays the complete solution with step-by-step breakdown
   * 
   * @param solution - Array of solution steps, or null if no solution found
   */
  public static printSolution(solution: SolutionStep[] | null): void {
    if (!solution) {
      console.log(`${LOG_PREFIXES.ERROR} No solution found!`);
      return;
    }

    console.log(`${LOG_PREFIXES.SUCCESS} Solution found!`);
    console.log();
    
    // Display initial state
    const initialState = new VaccinationState(
      APP_CONFIG.INITIAL_CHIHUAHUAS, 
      APP_CONFIG.INITIAL_CATS, 
      0, 0, 0, 0
    );
    console.log(`${LOG_PREFIXES.STEP} 0: ${initialState.toString()}`);
    
    // Display each solution step with detailed state information
    for (let i = 0; i < solution.length; i++) {
      const step = solution[i];
      console.log(`${LOG_PREFIXES.STEP} ${i + 1}: ${step.action}`);
      console.log(`        ${step.state.toString()}`);
    }
    
    console.log();
    console.log(`${LOG_PREFIXES.SUCCESS} All animals have been safely vaccinated!`);
  }

  /**
   * Displays search algorithm statistics
   * 
   * @param stats - Search statistics object
   * @param solutionLength - Number of steps in the solution
   */
  public static printStats(stats: { visitedStates: number }, solutionLength: number): void {
    console.log();
    console.log('Search Statistics:');
    console.log(`• States explored: ${stats.visitedStates}`);
    console.log(`• Solution steps: ${solutionLength}`);
    console.log();
    console.log(UI_ELEMENTS.SEPARATOR);
  }

  /**
   * Displays an error message with standard formatting
   * 
   * @param message - Error message to display
   */
  public static printError(message: string): void {
    console.error(`${LOG_PREFIXES.ERROR} ${message}`);
  }

  /**
   * Displays a success message with standard formatting
   * 
   * @param message - Success message to display
   */
  public static printSuccess(message: string): void {
    console.log(`${LOG_PREFIXES.SUCCESS} ${message}`);
  }

  /**
   * Displays an informational message with standard formatting
   * 
   * @param message - Information message to display
   */
  public static printInfo(message: string): void {
    console.log(`${LOG_PREFIXES.INFO} ${message}`);
  }
}

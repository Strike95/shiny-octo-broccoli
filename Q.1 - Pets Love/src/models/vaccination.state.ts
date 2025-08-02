import { IVaccinationState } from '../interfaces/vaccination-state.interface';
import { VaccinationMove } from '../interfaces/vaccination-move.interface';
import { APP_CONFIG } from '../constants/app-config.constants';
import { DISPLAY_SYMBOLS } from '../constants/display-symbols.constants';
import { UI_ELEMENTS } from '../constants/ui-elements.constants';

/**
 * Represents the state of the pets vaccination game
 * 
 * This class encapsulates the current distribution of animals across three locations:
 * - Waiting room: Animals waiting to be vaccinated
 * - Recovery room: Animals recovering after vaccination
 * - Vaccinated count: Total animals that have completed the vaccination process
 */
export class VaccinationState implements IVaccinationState {
  public readonly waitingChihuahuas: number;
  public readonly waitingCats: number;
  public readonly recoveryChihuahuas: number;
  public readonly recoveryCats: number;
  public readonly vaccinatedChihuahuas: number;
  public readonly vaccinatedCats: number;

  /**
   * Validates the current state according to safety constraints
   * 
   * Safety Rule: Chihuahuas attack cats if they outnumber cats in any room.
   * Exception: If there are no cats in a room, any number of chihuahuas is safe.
   * 
   * @returns true if the state is safe (no attacks), false otherwise
   */
  public get isValid(): boolean {
    // Check waiting room: Chihuahuas should not outnumber cats (unless there are no cats)
    if (this.waitingCats > 0 && this.waitingChihuahuas > this.waitingCats) {
      return false;
    }
    
    // Check recovery room: Chihuahuas should not outnumber cats (unless there are no cats)
    if (this.recoveryCats > 0 && this.recoveryChihuahuas > this.recoveryCats) {
      return false;
    }
    
    return true;
  }

  /**
   * Checks if the goal state has been reached
   * 
   * Goal: All animals must be vaccinated to complete the problem
   * 
   * @returns true if all animals have been vaccinated
   */
  public get isGoal(): boolean {
    return this.vaccinatedChihuahuas === APP_CONFIG.INITIAL_CHIHUAHUAS && 
           this.vaccinatedCats === APP_CONFIG.INITIAL_CATS;
  }

  /**
   * Generates a unique string key for state identification
   * 
   * Used for memoization in the search algorithm to avoid revisiting identical states
   * 
   * @returns unique string representation of the state
   */
  public get key(): string {
    return `${this.waitingChihuahuas}-${this.waitingCats}-${this.recoveryChihuahuas}-${this.recoveryCats}-${this.vaccinatedChihuahuas}-${this.vaccinatedCats}`;
  }

  /**
   * Generates all possible next states from the current state
   * 
   * Algorithm:
   * 1. Select 2 animals from waiting room (all combinations)
   * 2. Vaccinate them
   * 3. Return exactly 1 animal to waiting room, 1 to recovery room
   * 4. Filter only valid states (no attacks)
   * 
   * @returns array of valid next states with their corresponding actions
   */
  public get nextStates(): Array<{ state: VaccinationState; action: string }> {
    const nextStates: Array<{ state: VaccinationState; action: string }> = [];
    
    // Try all possible combinations of 2 animals from waiting room
    for (let chihuahuasToVaccinate = 0; chihuahuasToVaccinate <= Math.min(APP_CONFIG.MAX_SURGERY_CAPACITY, this.waitingChihuahuas); chihuahuasToVaccinate++) {
      const catsToVaccinate = APP_CONFIG.MAX_SURGERY_CAPACITY - chihuahuasToVaccinate;
      
      if (!this._isValidVaccinationCount(catsToVaccinate)) {
        continue;
      }

      this._generateDistributionStates(chihuahuasToVaccinate, catsToVaccinate, nextStates);
    }

    return nextStates;
  }

  constructor(
    waitingChihuahuas: number,
    waitingCats: number,
    recoveryChihuahuas: number,
    recoveryCats: number,
    vaccinatedChihuahuas: number,
    vaccinatedCats: number
  ) {
    this.waitingChihuahuas = waitingChihuahuas;
    this.waitingCats = waitingCats;
    this.recoveryChihuahuas = recoveryChihuahuas;
    this.recoveryCats = recoveryCats;
    this.vaccinatedChihuahuas = vaccinatedChihuahuas;
    this.vaccinatedCats = vaccinatedCats;
  }

  /**
   * Validates if we have enough cats for vaccination
   * @param catsToVaccinate Number of cats to vaccinate
   * @returns true if valid vaccination count
   */
  private _isValidVaccinationCount(catsToVaccinate: number): boolean {
    return catsToVaccinate >= 0 && catsToVaccinate <= this.waitingCats;
  }

  /**
   * Generates all valid distribution states for given vaccination counts
   * @param chihuahuasToVaccinate Number of chihuahuas to vaccinate
   * @param catsToVaccinate Number of cats to vaccinate  
   * @param nextStates Array to add valid states to
   */
  private _generateDistributionStates(
    chihuahuasToVaccinate: number, 
    catsToVaccinate: number, 
    nextStates: Array<{ state: VaccinationState; action: string }>
  ): void {
    // Try all ways to distribute the 2 vaccinated animals (1 to waiting, 1 to recovery)
    for (let chihuahuasToWaiting = 0; chihuahuasToWaiting <= chihuahuasToVaccinate; chihuahuasToWaiting++) {
      for (let catsToWaiting = 0; catsToWaiting <= catsToVaccinate; catsToWaiting++) {
        if (!this._isValidDistribution(chihuahuasToWaiting, catsToWaiting)) {
          continue;
        }

        const newState = this._createNewState(
          chihuahuasToVaccinate, 
          catsToVaccinate, 
          chihuahuasToWaiting, 
          catsToWaiting
        );

        if (newState.isValid) {
          const action = this._createActionDescription({
            chihuahuasToVaccinate,
            catsToVaccinate,
            chihuahuasToWaiting,
            catsToWaiting
          });

          nextStates.push({ state: newState, action });
        }
      }
    }
  }

  /**
   * Validates if exactly 1 animal returns to waiting room
   * @param chihuahuasToWaiting Number of chihuahuas returning to waiting
   * @param catsToWaiting Number of cats returning to waiting
   * @returns true if exactly 1 animal returns to waiting
   */
  private _isValidDistribution(chihuahuasToWaiting: number, catsToWaiting: number): boolean {
    return chihuahuasToWaiting + catsToWaiting === 1;
  }

  /**
   * Creates a new vaccination state based on move parameters
   * @param chihuahuasToVaccinate Number of chihuahuas to vaccinate
   * @param catsToVaccinate Number of cats to vaccinate
   * @param chihuahuasToWaiting Number of chihuahuas returning to waiting
   * @param catsToWaiting Number of cats returning to waiting
   * @returns new VaccinationState instance
   */
  private _createNewState(
    chihuahuasToVaccinate: number,
    catsToVaccinate: number, 
    chihuahuasToWaiting: number,
    catsToWaiting: number
  ): VaccinationState {
    const chihuahuasToRecovery = chihuahuasToVaccinate - chihuahuasToWaiting;
    const catsToRecovery = catsToVaccinate - catsToWaiting;

    return new VaccinationState(
      this.waitingChihuahuas - chihuahuasToVaccinate + chihuahuasToWaiting,
      this.waitingCats - catsToVaccinate + catsToWaiting,
      this.recoveryChihuahuas + chihuahuasToRecovery,
      this.recoveryCats + catsToRecovery,
      this.vaccinatedChihuahuas + chihuahuasToVaccinate,
      this.vaccinatedCats + catsToVaccinate
    );
  }

  /**
   * Creates a human-readable description of the vaccination action
   * 
   * @param move - The vaccination move details
   * @returns formatted action description
   */
  private _createActionDescription(move: VaccinationMove): string {
    const { chihuahuasToVaccinate, catsToVaccinate, chihuahuasToWaiting, catsToWaiting } = move;
    
    return `Vaccinate ${chihuahuasToVaccinate} chihuahua(s) and ${catsToVaccinate} cat(s). ` +
           `Return ${chihuahuasToWaiting} chihuahua(s) and ${catsToWaiting} cat(s) to waiting room.`;
  }

  /**
   * String representation of the current state
   * 
   * Format: "Waiting: XC Ycat | Recovery: XC Ycat | Vaccinated: XC Ycat"
   * 
   * @returns formatted state string
   */
  public toString(): string {
    return `Waiting: ${this.waitingChihuahuas}${DISPLAY_SYMBOLS.CHIHUAHUA} ${this.waitingCats}${DISPLAY_SYMBOLS.CAT}${UI_ELEMENTS.ROOM_SEPARATOR}` +
           `Recovery: ${this.recoveryChihuahuas}${DISPLAY_SYMBOLS.CHIHUAHUA} ${this.recoveryCats}${DISPLAY_SYMBOLS.CAT}${UI_ELEMENTS.ROOM_SEPARATOR}` +
           `Vaccinated: ${this.vaccinatedChihuahuas}${DISPLAY_SYMBOLS.CHIHUAHUA} ${this.vaccinatedCats}${DISPLAY_SYMBOLS.CAT}`;
  }
}

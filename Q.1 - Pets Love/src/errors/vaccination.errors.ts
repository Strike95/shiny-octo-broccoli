/**
 * Custom error classes for the pets vaccination problem
 */

/**
 * Base error class for all vaccination-related errors
 */
export abstract class VaccinationError extends Error {
  public readonly code: string;
  public readonly timestamp: Date;

  constructor(message: string, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date();
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error thrown when an invalid state is encountered
 */
export class InvalidStateError extends VaccinationError {
  constructor(message: string) {
    super(message, 'INVALID_STATE');
  }
}

/**
 * Error thrown when the solver cannot find a solution
 */
export class NoSolutionError extends VaccinationError {
  constructor(message: string) {
    super(message, 'NO_SOLUTION');
  }
}

/**
 * Error thrown when invalid animal counts are provided
 */
export class InvalidAnimalCountError extends VaccinationError {
  constructor(message: string) {
    super(message, 'INVALID_ANIMAL_COUNT');
  }
}

/**
 * Error thrown when an invalid move is attempted
 */
export class InvalidMoveError extends VaccinationError {
  constructor(message: string) {
    super(message, 'INVALID_MOVE');
  }
}

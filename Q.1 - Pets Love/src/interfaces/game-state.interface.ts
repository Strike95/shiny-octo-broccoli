/**
 * Game state interface definition
 */

import { AnimalCount } from './animal-count.interface';

export interface GameState {
  waiting: AnimalCount;
  recovery: AnimalCount;
  vaccinated: AnimalCount;
}

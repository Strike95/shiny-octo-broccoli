/**
 * Solution result interface definition
 */

import { SolutionPath } from '../types/solution-path.type';
import { SolutionStatistics } from './solution-statistics.interface';

export interface SolutionResult {
  solution: SolutionPath;
  statistics: SolutionStatistics;
}

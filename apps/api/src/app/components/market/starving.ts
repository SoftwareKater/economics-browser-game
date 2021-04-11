/**
 * Contains all utilities for the starving mechanics
 */

const MALUS_FROM_STARVING: { [key: string]: number } = {
  0: 1,
  1: 1,
  2: 0.95,
  3: 0.9,
  4: 0.8,
  5: 0.65,
  6: 0.45,
  7: 0.2,
  8: 0.15,
  9: 0.12,
  10: 0.1,
  11: 0.09,
  19: 0.01,
  20: 0,
};

export function getMalusFromStarving(starving: boolean, starvingFor?: number): number {
  if (!starving || !starvingFor) {
    return 1;
  }
  if (starvingFor < 21) {
    return MALUS_FROM_STARVING[starvingFor];
  }
  return 0;
}

import { City } from '@economics1k/data-access';

/**
 * Move this into a lib that can be accessed by both frontend and backend
 * @param city
 * @returns the number of homeless habitants
 */
export class CityStatistics {
  /**
   * where to put this function?
   * @param city
   * @returns The number of unemployed habitants
   */
  getUnemploymentCount(city: City): number {
    const unemployedHabitants = city.habitants.filter(
      (habitant) => !habitant.employment
    ).length;
    return unemployedHabitants;
  }

  getHomelessCount(city: City): number {
    const homelessHabitants = city.habitants.filter(
      (habitant) => !habitant.accommodation
    ).length;
    return homelessHabitants;
  }

  getLandUsage(city: City): number {
    if (!city.buildings || city.buildings.length < 1) {
      return 0;
    }
    const landUsage = city.buildings
      .map((building) => building.building.size)
      .reduce((a, b) => a + b);
    return landUsage;
  }

  //   function getMeanProductivity(habitant: Habitant) {
  //     const starvingMultiplier = getMalusFromStarving(
  //       habitant.starving,
  //       habitant.starvingFor
  //     );
  //     const productivity =
  //       habitant.baseProductivity *
  //       habitant.accommodation.productivityMultiplicator *
  //       starvingMultiplier;
  //     return productivity;
  //   }
}

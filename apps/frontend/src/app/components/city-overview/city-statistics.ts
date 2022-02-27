import { City } from '@economics1k/data-access';

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

  /**
   * where to put this function?
   * @param city
   * @returns the number of homeless habitants
   */
  getHomelessCount(city: City): number {
    const homelessHabitants = city.habitants.filter(
      (habitant) => !habitant.accommodation
    ).length;
    return homelessHabitants;
  }

  getLandUsage(city: City): number {
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

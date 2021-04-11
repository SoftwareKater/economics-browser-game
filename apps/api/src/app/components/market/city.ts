import { City } from '../../models/city.entity';
import { Habitant } from '../../models/habitant.entity';
import { getMalusFromStarving } from './starving';

/**
 * Utility funtions concerned with the city
 */
export class CityUtils {
  static getProductivity(habitant: Habitant) {
    const starvingMultiplier = getMalusFromStarving(
      habitant.starving,
      habitant.starvingFor
    );
    const productivity =
      habitant.baseProductivity *
      habitant.accommodation.productivityMultiplicator *
      starvingMultiplier;
    return productivity;
  }

  static getFreeSpace(city: City) {
    return city;
  }

  static getUnemploymentRate(city: City): number {
    const unemployedHabitants = city.habitants
      .map((habitant) => habitant.unemployed)
      .filter((value) => !!value).length;
    const unemploymentRate = unemployedHabitants / city.habitants.length;
    return unemploymentRate;
  }
}

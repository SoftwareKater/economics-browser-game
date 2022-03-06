// Fixed constants
export const TIME_OFFSET = 2 * 60 * 60 * 1000;
export const MS_IN_H = 60 * 60 * 1000;
export const MIN_PRODUCT_FRACTION = 0.01;

// Configurable constants
/**
 * Standard game speed is 1 round = 1 hour.
 * By increasing ECONOMY_SPEED_FACTOR the game progresses faster.
 * E.g. 60 -> 1 round = 1 minute
 */
export const ECONOMY_SPEED_FACTOR = 1 / 60;
export const INIT_HABITANTS_AMOUNT_PER_CITY = 100;
export const INIT_CITY_SIZE_IN_SQUARE_METER = 1000000;

export const JWT_MODULE_CONFIG = {
  /**
   * move this into gitlab secret
   */
  secret: 'secretKey',
  expriation: '600s',
};

export const TYPEORM_MODULE_CONFIG = {
    databaseName: 'test',
}
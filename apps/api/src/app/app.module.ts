import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { AuthModule } from './modules/auth/auth.module';
import { BuildingModule } from './components/building/building.module';
import { CityProductModule } from './components/city-product/city-product.module';
import { CityModule } from './modules/city/city.module';
import { ProductModule } from './components/product/product.module';
import { UserModule } from './modules/user/user.module';
import { BuildingConstructionCost } from './models/building-construction-cost.entity';
import { BuildingInput } from './models/building-input.entity';
import { BuildingMaintenanceCost } from './models/building-maintenance-cost.entity';
import { BuildingOutput } from './models/building-output.entity';
import { Building } from './models/building.entity';
import { CityBuilding } from './models/city-building.entity';
import { CityProduct } from './models/city-product.entity';
import { City } from './models/city.entity';
import { Habitant } from './models/habitant.entity';
import { Product } from './models/product.entity';
import { User } from './models/user.entity';
import { DbSeedModule } from './components/db-seed/db-seed.module';
import { TYPEORM_MODULE_CONFIG } from './constants';
import { BullModule } from '@nestjs/bull';

const BullRootModule = BullModule.forRoot({
  redis: {
    host: 'localhost',
    port: 6379,
  },
});

@Module({
  imports: [
    BullRootModule,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'tools/graphql/schema.gql'),
      context: ({ req }) => ({ req }),
    }),
    TypeOrmModule.forRoot({
      // logging: true,
      type: 'mysql',
      host: TYPEORM_MODULE_CONFIG.databaseHost,
      port: TYPEORM_MODULE_CONFIG.databasePort,
      username: TYPEORM_MODULE_CONFIG.databaseUser,
      password: TYPEORM_MODULE_CONFIG.databasePassword,
      database: TYPEORM_MODULE_CONFIG.databaseName,
      entities: [
        Building,
        BuildingConstructionCost,
        BuildingInput,
        BuildingMaintenanceCost,
        BuildingOutput,
        City,
        CityBuilding,
        CityProduct,
        Habitant,
        Product,
        User,
      ],
      synchronize: true,
      migrations: ['migration/*.js'],
      cli: {
        migrationsDir: 'migration',
      },
    }),
    ProductModule,
    CityModule,
    BuildingModule,
    UserModule,
    AuthModule,
    CityProductModule,
    DbSeedModule,
  ],
})
export class AppModule {}

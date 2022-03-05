import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './components/auth/auth.module';
import { BuildingModule } from './components/building/building.module';
import { CityModule } from './components/city/city.module';
import { ProductModule } from './components/product/product.module';
import { UserModule } from './components/user/user.module';
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

@Module({
  imports: [
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'tools/graphql/schema.gql'),
      context: ({ req }) => ({ req }),
    }),
    TypeOrmModule.forRoot({
      // logging: true,
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

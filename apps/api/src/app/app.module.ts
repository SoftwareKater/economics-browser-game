import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildingModule } from './components/building/building.module';
import { CityModule } from './components/city/city.module';
import { ProductModule } from './components/product/product.module';
import { Building } from './models/building.entity';
import { CityDevelopment } from './models/city-development.entity';
import { City } from './models/city.entity';
import { Product } from './models/product.entity';

@Module({
  imports: [
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'tools/graphql/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [Product, City, Building, CityDevelopment],
      synchronize: true,
      migrations: ["migration/*.js"],
      cli: {
        migrationsDir: 'migration',
      },
    }),
    ProductModule,
    CityModule,
    BuildingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

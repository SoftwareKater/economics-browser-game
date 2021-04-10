import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccommodationModule } from './components/accommodation/accommodation.module';
import { ProductModule } from './components/product/product.module';
import { ProductionSiteModule } from './components/production-sites/production-sites.module';
import { Accommodation } from './models/accommodation.entity';
import { Product } from './models/product.entity';
import { ProductionSite } from './models/production-site.entity';

@Module({
  imports: [
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'tools/graphql/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      // username: 'root',
      // password: 'root',
      // database: 'test',
      entities: [Product, Accommodation, ProductionSite],
      synchronize: true,
    }),
    ProductModule,
    AccommodationModule,
    ProductionSiteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

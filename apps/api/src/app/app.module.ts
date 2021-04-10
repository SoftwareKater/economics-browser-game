import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccommodationModule } from './components/accommodations/accommodation.module';
import { ProductModule } from './components/product/product.module';
import { Accommodation } from './entities/accommodation.entity';
import { Product } from './entities/product.entity';

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
      entities: [Product, Accommodation],
      synchronize: true,
    }),
    ProductModule,
    AccommodationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

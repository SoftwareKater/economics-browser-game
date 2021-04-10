import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from './product.entity';

@ObjectType()
export class ProductAmount {
  @Field((type) => Product)
  product?: Product;

  @Field((type) => Int)
  amount?: number;
}

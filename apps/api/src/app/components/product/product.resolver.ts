import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Product } from '../../models/product.entity';
import { ProductService } from './product.service';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {
    this.productService.initMockProducts();
  }

  @Query(() => [Product])
  async products() {
    return this.productService.findAll();
  }

  // @Query(() => Product)
  // async product(@Args('id', { type: () => Int }) id: number) {
  //   return this.productService.findOneById(id);
  // }
}

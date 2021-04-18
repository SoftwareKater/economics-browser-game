import { Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../models/product.entity';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,) {
  }

  @Query(() => [Product])
  async products() {
    return this.productRepository.find();
  }
}

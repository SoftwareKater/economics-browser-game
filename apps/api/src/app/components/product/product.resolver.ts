import { Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PRODUCTS } from '../../mocks/products';
import { Product } from '../../models/product.entity';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,) {
    this.initMockProducts();
  }

  @Query(() => [Product])
  async products() {
    return this.productRepository.find();
  }

  async initMockProducts(): Promise<void> {
    for (const product of Object.values(PRODUCTS)) {
      try {
        const res = await this.productRepository.save(product);
      } catch (err) {
        console.warn(err.message);
      }
    }
  }
}

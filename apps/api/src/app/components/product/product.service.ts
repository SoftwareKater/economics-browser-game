import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { PRODUCTS } from '../../mocks/products';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  findOneById(id: number): Promise<Product | undefined> {
    return this.productRepository.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async save(product: Product): Promise<void> {
    await this.productRepository.save(product);
  }

  async initMockProducts(): Promise<void> {
    for (const product of PRODUCTS) {
      try {
        await this.save(product);
      } catch (err) {
        console.warn(err.message);
      }
    }
  }
}

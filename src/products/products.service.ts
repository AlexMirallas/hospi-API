import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductCombination } from './entities/product-combination.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update.dto';
import { ProductResponseDto } from './dto/response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductCombination)
    private combinationRepository: Repository<ProductCombination>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const product = this.productRepository.create(createProductDto);
    
    if (createProductDto.categoryIds) {
      product.categories = createProductDto.categoryIds.map(id => ({ id })) as any;
    }

    await this.productRepository.save(product);
    return this.findOne(product.id);
  }

  async findAll(): Promise<ProductResponseDto[]> {
    return this.productRepository.find({
      relations: ['categories', 'combinations', 'combinations.attributeValues'],
    });
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories', 'combinations', 'combinations.attributeValues'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.findOne(id);

    if (updateProductDto.categoryIds) {
      product.categories = updateProductDto.categoryIds.map(id => ({ id })) as any;
    }

    Object.assign(product, updateProductDto);
    await this.productRepository.save(product);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id }
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.productRepository.remove(product);
  }
}
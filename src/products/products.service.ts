import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant, Size } from './entities/product-variant.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private variantRepository: Repository<ProductVariant>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { variants, ...productData } = createProductDto;
    const product = this.productRepository.create(productData);
    const savedProduct = await this.productRepository.save(product);

    const productVariants = variants.map(variant =>
      this.variantRepository.create({
        ...variant,
        product: savedProduct,
      }),
    );

    await this.variantRepository.save(productVariants);
    const result = await this.productRepository.findOne({
      where: { id: savedProduct.id },
      relations: ['variants'],
    });

    if (!result) {
      throw new NotFoundException(`Product with ID ${savedProduct.id} not found`);
    }

    return result;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['variants'],
    });
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['variants'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.getProductById(id);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async deleteProduct(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}

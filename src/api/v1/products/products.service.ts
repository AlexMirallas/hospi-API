import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductCombination } from './entities/product-combination.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update.dto';
import { ProductResponseDto } from './dto/response.dto';
import { Pagination,IPaginationOptions,paginate } from 'nestjs-typeorm-paginate';
import { Category } from '../products/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductCombination)
    private combinationRepository: Repository<ProductCombination>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    console.log("Creating product instance using DTO")// Create product instance
    const product = this.productRepository.create({
      ...createProductDto,
      categories: []
    });
    
    if (createProductDto.categories?.length) {
      const categories = await this.productRepository.manager.getRepository(Category)
        .createQueryBuilder('category')
        .where('category.id IN (:...ids)', { ids: createProductDto.categories })
        .getMany();

      console.log('Found categories:', categories);

      if (categories.length !== createProductDto.categories.length) {
        throw new NotFoundException('Some categories were not found');
      }

      product.categories = categories;
    }

    // Save with categories
    const savedProduct = await this.productRepository.save(product);
    console.log('Saved product:', savedProduct);
    
    // Fetch fresh data with all relations
    return this.findOne(savedProduct.id);
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
    console.log('Updating product:', id, 'with data:', updateProductDto);
  
    // Find product with relations
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories']
    });
  
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  
    // Handle categories separately
    if (updateProductDto.categories !== undefined) {
      console.log('Updating categories:', updateProductDto.categories);
      
      // Get categories even if array is empty (to clear categories)
      const categories = updateProductDto.categories.length > 0 
        ? await this.productRepository.manager.getRepository(Category)
            .createQueryBuilder('category')
            .where('category.id IN (:...ids)', { ids: updateProductDto.categories })
            .getMany()
        : [];
  
      // Validate categories if IDs were provided
      if (updateProductDto.categories.length > 0 && 
          categories.length !== updateProductDto.categories.length) {
        throw new NotFoundException('Some categories were not found');
      }
  
      // Assign new categories
      product.categories = categories;
      
      // Remove categoryIds from DTO to prevent double processing
      delete updateProductDto.categories;
    }
  
    // Update other fields
    Object.assign(product, updateProductDto);
  
    // Save changes
    const savedProduct = await this.productRepository.save(product);
    console.log('Updated product:', savedProduct);
  
    // Return fresh data with all relations
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

  async paginate(options:IPaginationOptions):Promise<Pagination<ProductResponseDto>>{
    return paginate<ProductResponseDto>(this.productRepository, options);
  }

  async getCategories(productId: string): Promise<Category[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories')
      .where('product.id = :productId', { productId })
      .getOne()
      .then(product => product?.categories || []);
  }
}
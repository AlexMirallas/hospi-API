import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCombination } from './entities/product-combination.entity';
import { Product } from './entities/product.entity';
import { Value } from './entities/value.entity';
import { CreateCombinationDto } from './dto/create-combination.dto';
import { UpdateCombinationDto } from './dto/update.dto';
import { Pagination,IPaginationOptions,paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class CombinationsService {
  constructor(
    @InjectRepository(ProductCombination)
    private combinationRepository: Repository<ProductCombination>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Value)
    private attributeValueRepository: Repository<Value>,
  ) {}

  async create(productId: string, createDto: CreateCombinationDto): Promise<ProductCombination> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const attributeValues = await this.attributeValueRepository.findByIds(
      createDto.attributeValueIds,
    );

    if (attributeValues.length !== createDto.attributeValueIds.length) {
      throw new NotFoundException('Some attribute values were not found');
    }

    const combination = this.combinationRepository.create({
      ...createDto,
      product,
      attributeValues,
    });

    return this.combinationRepository.save(combination);
  }

  async findByProduct(productId: string): Promise<ProductCombination[]> {
    return this.combinationRepository.find({
      where: { product: { id: productId } },
      relations: ['values', 'values.attribute'],
    });
  }

  async update(id: string, updateDto: UpdateCombinationDto): Promise<ProductCombination> {
    const combination = await this.combinationRepository.findOne({
      where: { id },
      relations: ['attributeValues'],
    });

    if (!combination) {
      throw new NotFoundException(`Combination with ID ${id} not found`);
    }

    if (updateDto.attributeValueIds) {
      const attributeValues = await this.attributeValueRepository.findByIds(
        updateDto.attributeValueIds,
      );
      combination.attributeValues = attributeValues;
    }

    Object.assign(combination, updateDto);
    return this.combinationRepository.save(combination);
  }

  async remove(id: string): Promise<void> {
    await this.combinationRepository.delete(id);
  }

  async paginate(options:IPaginationOptions):Promise<Pagination<ProductCombination>>{
    return paginate<ProductCombination>(this.combinationRepository, options);
  }
}
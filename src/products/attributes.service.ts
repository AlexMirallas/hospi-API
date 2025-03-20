import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attribute } from './entities/attribute.entity';
import { AttributeValue } from './entities/attribute-value.entity';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeDto, UpdateAttributeValueDto } from './dto/update.dto';

@Injectable()
export class AttributesService {
  constructor(
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
    @InjectRepository(AttributeValue)
    private attributeValueRepository: Repository<AttributeValue>,
  ) {}

  async createAttribute(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    const attribute = this.attributeRepository.create(createAttributeDto);
    return this.attributeRepository.save(attribute);
  }

  async createAttributeValue(createValueDto: CreateAttributeValueDto): Promise<AttributeValue> {
    const attribute = await this.attributeRepository.findOne({
      where: { id: createValueDto.attributeId },
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${createValueDto.attributeId} not found`);
    }

    const value = this.attributeValueRepository.create({
      ...createValueDto,
      attribute,
    });

    return this.attributeValueRepository.save(value);
  }

  async findAllAttributes(): Promise<Attribute[]> {
    return this.attributeRepository.find({
      relations: ['values'],
      order: { position: 'ASC' },
    });
  }

  async findAttributeById(id: string): Promise<Attribute> {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
      relations: ['values'],
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }

    return attribute;
  }
}
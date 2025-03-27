import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attribute } from './entities/attribute.entity';
import { Value } from './entities/value.entity';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update.dto';
import { Pagination,IPaginationOptions,paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class AttributesService {
  constructor(
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
    @InjectRepository(Value)
    private attributeValueRepository: Repository<Value>,
  ) {}

  async createAttribute(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    const attribute = this.attributeRepository.create(createAttributeDto);
    return this.attributeRepository.save(attribute);
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

  async paginate(options:IPaginationOptions):Promise<Pagination<Attribute>>{
    return paginate<Attribute>(this.attributeRepository, options);
  }

  async getAttributeValues(id: string): Promise<Value[]> {
    return this.attributeValueRepository.find({
      where: { attribute: { id } },
      order: { position: 'ASC' },
    });
  }

  async updateAttribute(id: string, updateAttributeDto: UpdateAttributeDto): Promise<Attribute> {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
      relations: ['values'],
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }

    return this.attributeRepository.save({
      ...attribute,
      ...updateAttributeDto,
    });
  }

  async deleteAttribute(id: string): Promise<Attribute> {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
      relations: ['values'],
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }

    return this.attributeRepository.remove(attribute);
  }
}
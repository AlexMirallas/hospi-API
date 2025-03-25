import { Injectable } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateValueDto } from "./dto/create-value.dto";
import { AttributeValue } from "./entities/value.entity";
import { Attribute } from "./entities/attribute.entity";
import { Pagination,IPaginationOptions,paginate } from 'nestjs-typeorm-paginate';
import { UpdateValueDto } from "./dto/update.dto";

@Injectable()
export class ValuesService {
  constructor(
    @InjectRepository(AttributeValue)
    private attributeValueRepository: Repository<AttributeValue>,
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
  ) {}

  async createAttributeValue(createValueDto: CreateValueDto): Promise<AttributeValue> {
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

  async findAllValues(): Promise<AttributeValue[]> {
    return this.attributeValueRepository.find();
  }

  async findValueById(id: string): Promise<AttributeValue> {
    const value = await this.attributeValueRepository.findOne({
      where: { id },
    });

    if (!value) {
      throw new NotFoundException(`Attribute value with ID ${id} not found`);
    }

    return value;
  }

  async updateValue(id: string, updateValueDto: UpdateValueDto): Promise<AttributeValue> {
    const value = await this.attributeValueRepository.findOne({
      where: { id },
    });

    if (!value) {
      throw new NotFoundException(`Attribute value with ID ${id} not found`);
    }

    return this.attributeValueRepository.save({
      ...value,
      ...updateValueDto,
    });
  }

  async deleteValue(id: string): Promise<AttributeValue> {
    const value = await this.attributeValueRepository.findOne({
      where: { id },
    });

    if (!value) {
      throw new NotFoundException(`Attribute value with ID ${id} not found`);
    }

    return this.attributeValueRepository.remove(value);
  }

  async paginate(options:IPaginationOptions):Promise<Pagination<AttributeValue>>{
    return paginate<AttributeValue>(this.attributeValueRepository, options);
  }
}

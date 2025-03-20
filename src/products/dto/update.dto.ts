import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { CreateCombinationDto } from './create-combination.dto';
import { CreateAttributeDto } from './create-attribute.dto';
import { CreateAttributeValueDto } from './create-attribute-value.dto';
import { CreateCategoryDto } from './create-category.dto';


export class UpdateProductDto extends PartialType(CreateProductDto) {}
export class UpdateCombinationDto extends PartialType(CreateCombinationDto) {}
export class UpdateAttributeDto extends PartialType(CreateAttributeDto) {}
export class UpdateAttributeValueDto extends PartialType(CreateAttributeValueDto) {}
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
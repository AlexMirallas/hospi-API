import { IsString, IsNumber, IsArray, ValidateNested, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Size } from '../entities/product-variant.entity';

export class ProductVariantDto {
  @IsEnum(Size)
  size: Size;

  @IsString()
  color: string;

  @IsNumber()
  stockQuantity: number;

  @IsNumber()
  @IsOptional()
  variantPrice?: number;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  brand: string;

  @IsString()
  category: string;

  @IsNumber()
  basePrice: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants: ProductVariantDto[];
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  basePrice?: number;
}

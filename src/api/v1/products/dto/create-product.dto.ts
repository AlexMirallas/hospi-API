import { IsString, IsNumber, IsBoolean, IsOptional, IsUUID, IsArray, } from 'class-validator';


export class CreateProductDto {
  @IsString()
  reference: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  basePrice: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;


  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  categoryIds?: string[];
}
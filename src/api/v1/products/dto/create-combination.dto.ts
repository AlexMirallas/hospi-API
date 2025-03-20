import { IsString, IsNumber, IsBoolean, IsOptional, IsUUID, IsArray } from 'class-validator';

export class CreateCombinationDto {
  @IsString()
  reference: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  impactOnPrice?: number;

  @IsNumber()
  quantity: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsArray()
  @IsUUID(undefined, { each: true })
  attributeValueIds: string[];
}
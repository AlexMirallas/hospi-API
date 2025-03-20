import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateAttributeValueDto {
  @IsString()
  value: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsNumber()
  @IsOptional()
  position?: number;

  @IsUUID()
  attributeId: string;
}
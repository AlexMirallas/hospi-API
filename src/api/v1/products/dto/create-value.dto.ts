import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateValueDto {
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
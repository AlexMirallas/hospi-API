import { IsString, IsNumber, IsBoolean, IsOptional, } from 'class-validator';

export class CreateAttributeDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  position?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
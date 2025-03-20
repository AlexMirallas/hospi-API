export class ProductResponseDto {
  id: string;
  reference: string;
  name: string;
  description: string;
  basePrice: number;
  active: boolean;
  categories: CategoryResponseDto[];
  combinations: CombinationResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class CombinationResponseDto {
  id: string;
  reference: string;
  price: number;
  impactOnPrice: number;
  quantity: number;
  active: boolean;
  attributeValues: AttributeValueResponseDto[];
}

export class AttributeResponseDto {
  id: string;
  name: string;
  position: number;
  active: boolean;
  values: AttributeValueResponseDto[];
}

export class AttributeValueResponseDto {
  id: string;
  value: string;
  color?: string;
  position: number;
  attribute: AttributeResponseDto;
}

export class CategoryResponseDto {
  id: string;
  name: string;
  active: boolean;
  position: number;
}
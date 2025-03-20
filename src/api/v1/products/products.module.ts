import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { AttributesController } from './attributes.controller';
import { CombinationsController } from './combinations.controller';
import { CategoriesController } from './categories.controller';
import { ProductsService } from './products.service';
import { AttributesService } from './attributes.service';
import { CombinationsService } from './combinations.service';
import { CategoriesService } from './categories.service';
import { Product } from './entities/product.entity';
import { ProductCombination } from './entities/product-combination.entity';
import { Attribute } from './entities/attribute.entity';
import { AttributeValue } from './entities/attribute-value.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductCombination,
      Attribute,
      AttributeValue,
      Category,
    ]),
  ],
  controllers: [
    ProductsController,
    AttributesController,
    CombinationsController,
    CategoriesController,
  ],
  providers: [
    ProductsService,
    AttributesService,
    CombinationsService,
    CategoriesService,
  ],
  exports: [
    ProductsService,
    AttributesService,
    CombinationsService,
    CategoriesService,
  ],
})
export class ProductsModule {}
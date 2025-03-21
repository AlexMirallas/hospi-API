import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update.dto';
import { ProductResponseDto } from './dto/response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('v1/products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/create')
  create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    return this.productsService.create(createProductDto);
  }

  @Get('/list')
  findAll(): Promise<ProductResponseDto[]> {
    return this.productsService.findAll();
  }

  @Get('/show/:id')
  findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productsService.findOne(id);
  }

  @Patch('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
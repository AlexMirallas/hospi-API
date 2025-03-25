import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res, } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update.dto';
import { ProductResponseDto } from './dto/response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { Category } from '../products/entities/category.entity';


@Controller('v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    return this.productsService.create(createProductDto);
  }


  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Res() res: Response
  ): Promise<any> {
    const pagination =  await this.productsService.paginate({ 
      page, 
      limit,
      route: '/v1/products',
    });
    const total = pagination.meta.totalItems;
    const start = (page - 1) * limit;
    const end = start + pagination.items.length - 1;

    return res
    .header('Content-Range', `${start}-${end}/${total}`)
    .json({
      data: pagination.items,
      total: total
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productsService.findOne(id);
  }

  @Get(':id/categories')
  async getCategories(@Param('id') id: string): Promise<Category[]> {
    return this.productsService.getCategories(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('v1/products/categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('/create')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get('/list')
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('/show/:id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }
}
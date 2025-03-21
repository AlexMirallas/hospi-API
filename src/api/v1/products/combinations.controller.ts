import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { CombinationsService } from './combinations.service';
import { CreateCombinationDto } from './dto/create-combination.dto';
import { UpdateCombinationDto } from './dto/update.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('v1/products/:productId/combinations')
@UseGuards(JwtAuthGuard)
export class CombinationsController {
  constructor(private readonly combinationsService: CombinationsService) {}

  @Post('/create')
  create(
    @Param('productId') productId: string,
    @Body() createCombinationDto: CreateCombinationDto,
  ) {
    return this.combinationsService.create(productId, createCombinationDto);
  }

  @Get('/list')
  findByProduct(@Param('productId') productId: string) {
    return this.combinationsService.findByProduct(productId);
  }

  @Patch('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updateCombinationDto: UpdateCombinationDto,
  ) {
    return this.combinationsService.update(id, updateCombinationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.combinationsService.remove(id);
  }
}
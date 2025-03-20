import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { CombinationsService } from './combinations.service';
import { CreateCombinationDto } from './dto/create-combination.dto';
import { UpdateCombinationDto } from './dto/update.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('v1/products/:productId/combinations')
@UseGuards(JwtAuthGuard)
export class CombinationsController {
  constructor(private readonly combinationsService: CombinationsService) {}

  @Post()
  create(
    @Param('productId') productId: string,
    @Body() createCombinationDto: CreateCombinationDto,
  ) {
    return this.combinationsService.create(productId, createCombinationDto);
  }

  @Get()
  findByProduct(@Param('productId') productId: string) {
    return this.combinationsService.findByProduct(productId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCombinationDto: UpdateCombinationDto,
  ) {
    return this.combinationsService.update(id, updateCombinationDto);
  }
}
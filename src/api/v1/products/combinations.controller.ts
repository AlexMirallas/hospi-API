import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query, ParseIntPipe, DefaultValuePipe, Res } from '@nestjs/common';
import { CombinationsService } from './combinations.service';
import { CreateCombinationDto } from './dto/create-combination.dto';
import { UpdateCombinationDto } from './dto/update.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

@Controller('v1/combinations')
export class CombinationsController {
  constructor(private readonly combinationsService: CombinationsService) {}

  @Post('/create')
  create(
    @Param('productId') productId: string,
    @Body() createCombinationDto: CreateCombinationDto,
  ) {
    return this.combinationsService.create(productId, createCombinationDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Res() res: Response
  ): Promise<any> {
    const pagination =  await this.combinationsService.paginate({ 
      page, 
      limit,
      route: '/v1/combinations',
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
  

  @Patch(':id')
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
import { Controller, Get, Post, Body, Param, UseGuards, Query, ParseIntPipe, DefaultValuePipe, Res, Patch, Delete } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { CreateValueDto  } from './dto/create-value.dto';
import { Response } from 'express';
import { UpdateAttributeDto } from './dto/update.dto';
import { ValuesService } from './values.service';


@Controller('v1/attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService, private readonly valuesService: ValuesService) {}

  @Post()
  createAttribute(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributesService.createAttribute(createAttributeDto);
  }

  @Post('values')
  createValue(@Body() createValueDto: CreateValueDto) {
    return this.valuesService.createAttributeValue(createValueDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Res() res: Response
  ): Promise<any> {
    const pagination =  await this.attributesService.paginate({ 
      page, 
      limit,
      route: '/v1/attributes',
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
  findOne(@Param('id') id: string) {
    return this.attributesService.findAttributeById(id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttributeDto: UpdateAttributeDto) {
    return this.attributesService.updateAttribute(id, updateAttributeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributesService.deleteAttribute(id);
  }

  
}
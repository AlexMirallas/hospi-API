import { Controller, Post, Body, Get, Param, Query, Res, Patch, Delete, DefaultValuePipe, ParseIntPipe } from "@nestjs/common";
import { ValuesService } from "./values.service";
import { CreateValueDto } from "./dto/create-value.dto";
import { UpdateValueDto } from "./dto/update.dto";
import { Response } from "express";





@Controller('v1/values')
export class ValuesController {
  constructor(private readonly valuesService: ValuesService) {}

  @Post()
  createValue(@Body() createValueDto: CreateValueDto) {
    return this.valuesService.createAttributeValue(createValueDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('attributeId') attributeId: string,
    @Res() res: Response
  ): Promise<any> {
    const pagination =  await this.valuesService.paginate({ 
      page, 
      limit,
      route: '/v1/values',
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
    return this.valuesService.findValueById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateValueDto: UpdateValueDto) {
    return this.valuesService.updateValue(id, updateValueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.valuesService.deleteValue(id);
  }
}
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('v1/attributes')
@UseGuards(JwtAuthGuard)
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Post()
  createAttribute(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributesService.createAttribute(createAttributeDto);
  }

  @Post('values')
  createAttributeValue(@Body() createValueDto: CreateAttributeValueDto) {
    return this.attributesService.createAttributeValue(createValueDto);
  }

  @Get()
  findAll() {
    return this.attributesService.findAllAttributes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributesService.findAttributeById(id);
  }
}
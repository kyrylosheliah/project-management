import { Body, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
import { BaseCrudService } from "src/common/base-crud/base-crud.service";
import { DeepPartial } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export abstract class BaseCrudController<T> {
  constructor(protected readonly service: BaseCrudService<T>) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  // Note: override with correct CreateSomeEntityDto
  @Post()
  create(@Body() createDto: any) {
    return this.service.create(createDto as DeepPartial<T>);
  }

  // Note: override with correct UpdateSomeEntityDto
  @Put(':id')
  update(@Param('id') id: number, @Body() updateDto: any) {
    return this.service.update(id, updateDto as QueryDeepPartialEntity<T>);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
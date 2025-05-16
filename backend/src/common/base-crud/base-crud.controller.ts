import { Body, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { BaseCrudService } from "src/common/base-crud/base-crud.service";
import { DeepPartial } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export class BaseCrudController<T, CreateDto, UpdateDto> {
  constructor(protected readonly service: BaseCrudService<T>) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateDto) {
    return this.service.create(createDto as DeepPartial<T>);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateDto: UpdateDto) {
    return this.service.update(id, updateDto as QueryDeepPartialEntity<T>);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
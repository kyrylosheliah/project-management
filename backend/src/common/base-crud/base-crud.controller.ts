import { Body, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { BaseCrudService } from "src/common/base-crud/base-crud.service";
import { SearchEntitiesDto } from "src/common/base-crud/dto/search-entity.dto";
import { DeepPartial } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export abstract class BaseCrudController<T> {
  constructor(protected readonly service: BaseCrudService<T>) {}

  @Post('search')
  search(@Body() req: SearchEntitiesDto) {
    return this.service.search(req);
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.service.get(id);
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
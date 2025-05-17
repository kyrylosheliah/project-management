import { Injectable, NotFoundException } from "@nestjs/common";
import { DeepPartial, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export abstract class BaseCrudService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<T> {
    return this.repository.findOneOrFail({ where: { id } as any });
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: QueryDeepPartialEntity<T>): Promise<T> {
    //const entity = await this.repository.preload({ ...data, id });
    //if (!entity) {
    //  throw new NotFoundException(`Not found, id {id}`);
    //}
    //await this.repository.save(entity);
    //return this.findOne(entity.id);
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
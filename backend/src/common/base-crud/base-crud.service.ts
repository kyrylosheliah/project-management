import { SearchEntitiesDto } from "src/common/base-crud/dto/search-entity.dto";
import { DeepPartial, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export abstract class BaseCrudService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async search(
    req: SearchEntitiesDto,
  ): Promise<{ pageCount: number; items: T[] }> {
    // filtering
    let criteria: object | undefined;
    if (req.criteria !== null) {
      criteria = {};
      for (const [column, criterion] of Object.entries(req.criteria)) {
        // TODO: validate `column: keyof T`
        if (criterion !== '') {
          // TODO: criteria[column] = Like(`%${criterion}%`);
          criteria[column] = criterion;
        }
      }
    }
    // ordering
    const toOrder: any = {
      // TODO: validate `orderByColumn: keyof T`
      [req.orderByColumn]: req.ascending ? 'ASC' : 'DESC',
    };
    // commence query
    const toSkip = (req.pageNo - 1) * req.pageSize;
    const toTake = req.pageSize;
    const [items, searchCount] = await this.repository.findAndCount({
      where: criteria,
      order: toOrder,
      skip: toSkip,
      take: toTake,
    });
    // pagination
    const pageModulo = searchCount % req.pageSize;
    const pageCount =
      (searchCount - pageModulo) / req.pageSize + (pageModulo === 0 ? 0 : 1);

    return {
      pageCount,
      items,
    };
  }

  async getAll(): Promise<T[]> {
    return this.repository.find();
  }

  async get(id: number): Promise<T> {
    // ERROR: status 500 "Internal server error" when an entity wasn't found
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
    return this.get(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
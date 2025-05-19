import { SearchEntitiesDto } from "src/common/base-crud/dto/search-entity.dto";
import { DeepPartial, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export abstract class BaseCrudService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async search(req: SearchEntitiesDto): Promise<{ pageCount: number, items: T[] }> {
    let entities = this.repository;
    // pagination
    let searchCount = await entities.count();
    if (searchCount == 0) {
      return { pageCount: 0, items: [] };
    }
    const pageModulo = searchCount % req.pageSize;
    const pageCount = (searchCount - pageModulo) / req.pageSize + (pageModulo === 0 ? 0 : 1);
    const toSkip = (req.pageNo - 1) * req.pageSize;
    const toTake = req.pageSize;
    // filtering
    let criteria: object | undefined;
    if (req.criteria !== null) {
      criteria = {};
      for (const [column, criterion] of Object.entries(req.criteria)) {
        // validate `column: keyof T`
        if (criterion !== "") {
          //criteria[column] = Like(`%${criterion}%`);
          criteria[column] = criterion;
        }
      }
    }
    // ordering
    const toOrder: any = {
      // validate `orderByColumn: keyof T`
      [req.orderByColumn]: req.ascending ? 'ASC' : 'DESC',
    }
    // commence query
    return {
      pageCount,
      items: await entities.find({
        where: criteria,
        order: toOrder,
        skip: toSkip,
        take: toTake,
      }),
    };
  }

  async getAll(): Promise<T[]> {
    return this.repository.find();
  }

  async get(id: number): Promise<T> {
    // TODO: status 500 "Internal server error" when an entity wasn't found
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
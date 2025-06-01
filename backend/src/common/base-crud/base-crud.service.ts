import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { SearchEntitiesDto } from "src/common/search/search-entity.dto";
import { getSearchableFields } from "src/common/search/search.utils";
import { isValidColumn } from "src/common/utils/isValidColumn";
import { Brackets, DeepPartial, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export abstract class BaseCrudService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async search(
    req: SearchEntitiesDto,
    entity: Function,
  ): Promise<{ pageCount: number; items: T[] }> {
    const searchableFields = getSearchableFields(entity);
    const qb = this.repository.createQueryBuilder('e');
    // optional filtering
    for (const [column, criterion] of Object.entries(req.criteria)) {
      if (!isValidColumn(entity, column)) {
        throw new BadRequestException(
          `Invalid criterion column name: ${column}`,
        );
      }
      if (criterion !== '') {
        qb.andWhere(`e.${column} = :${column}`, { [column]: criterion });
      }
    }
    // mandatory filtering
    const filter = req.globalFilter.trim();
    if (filter !== '') {
      qb.andWhere(
        new Brackets((qbInner) => {
          searchableFields.forEach(({ key, type }, index) => {
            const paramName = `global${index}`;
            let expression: string;
            switch (type) {
              case 'exact':
                expression = `e.${key} = :${paramName}`;
                qbInner.orWhere(expression, { [paramName]: filter });
                break;
              case 'partial':
                expression = `e.${key} ILIKE :${paramName}`;
                qbInner.orWhere(expression, { [paramName]: `%${filter}%` });
                break;
              case 'prefix':
                expression = `e.${key} ILIKE :${paramName}`;
                qbInner.orWhere(expression, { [paramName]: `${filter}%` });
                break;
              case 'suffix':
                expression = `e.${key} ILIKE :${paramName}`;
                qbInner.orWhere(expression, { [paramName]: `%${filter}` });
                break;
            }
          });
        }),
      );
    }
    // ordering
    if (!isValidColumn(entity, req.orderByColumn)) {
      throw new BadRequestException(
        `Invalid orderByColumn: ${req.orderByColumn}`,
      );
    }
    qb.orderBy(`e.${req.orderByColumn}`, req.ascending ? 'ASC' : 'DESC');
    // commence query
    const toSkip = (req.pageNo - 1) * req.pageSize;
    const toTake = req.pageSize;
    qb.skip(toSkip).take(toTake);
    const [items, searchCount] = await qb.getManyAndCount();
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
    return this.repository.find().catch((err) => {
      throw new NotFoundException(err.message);
    });
  }

  async get(id: number): Promise<T> {
    return this.repository
      .findOneOrFail({ where: { id } as any })
      .catch((err) => {
        throw new NotFoundException(err.message);
      });
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity).catch((err) => {
      throw new ConflictException(err.message);
    });
  }

  async update(id: number, data: QueryDeepPartialEntity<T>): Promise<T> {
    return this.repository
      .update(id, data)
      .then(() => this.get(id))
      .catch((err) => {
        throw new NotFoundException(err.message);
      });
  }

  async remove(id: number): Promise<void> {
    this.repository.delete(id).catch(err => {
      throw new BadRequestException(err.message);
    });
  }
}
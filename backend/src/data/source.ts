import { Project } from "./project/entity";
import { Task } from "./task/entity";
import { User } from "./user/entity";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'password',
  database: 'ProjectManagement',
  entities: [ User, Project, Task ],
  migrations: [ 'src/migrations/*.ts' ],
  synchronize: false,
  logging: false,
});

// // Migrations
// "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d ./src/data/source.ts"
// // `npx ts-node ...` otherwise
// npm run typeorm migration:generate ./src/migrations/InitSchema
// npm run typeorm migration:run
// npm run typeorm migration:revert

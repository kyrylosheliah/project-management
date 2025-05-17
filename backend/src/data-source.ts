import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config';
import { User } from "./data/user/user.entity";
import { Project } from "./data/project/project.entity";
import { Task } from "./data/task/task.entity";

export const databaseOptions = {
  type: 'postgres',
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5433,
  username: process.env.PG_USERNAME || "postgres",
  password: process.env.PG_PASSWORD || "password",
  database: process.env.PG_NAME || "ProjectManagement",
  entities: [ User, Project, Task ],
  synchronize: false,
  logging: false,
};

export const AppDataSource = new DataSource({
  ...databaseOptions as any,
  migrations: [ 'src/migrations/*.ts' ],
});

// // Migrations
// "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d ./src/data-source.ts"
// // `npx ts-node ...` otherwise
// npm run typeorm migration:generate ./src/migrations/InitSchema
// npm run typeorm migration:run
// npm run typeorm migration:revert

// check `-r dotenv/config` effect for migrations
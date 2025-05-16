import { Project } from "./project/entity";
import { Task } from "./task/entity";
import { User } from "./user/entity";
import { DataSource } from "typeorm";
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5433,
  username: process.env.PG_USERNAME || "postgres",
  password: process.env.PG_PASSWORD || "password",
  database: process.env.PG_NAME || "ProjectManagement",
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

// check `-r dotenv/config` effect
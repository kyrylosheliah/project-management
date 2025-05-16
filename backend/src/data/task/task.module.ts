import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskController } from "src/data/task/task.controller";
import { Task } from "src/data/task/task.entity";
import { TaskService } from "src/data/task/task.service";

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
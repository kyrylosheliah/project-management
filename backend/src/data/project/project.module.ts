import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectController } from "src/data/project/project.controller";
import { Project } from "src/data/project/project.entity";
import { ProjectService } from "src/data/project/project.service";

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
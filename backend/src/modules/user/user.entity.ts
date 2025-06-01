import { Searchable } from "src/common/search/searchable.decorator";
import { Project } from "src/modules/project/project.entity";
import { Task } from "src/modules/task/task.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Searchable({ type: "partial" })
  name: string;

  @Column({ unique: true })
  @Searchable({ type: "exact" })
  email: string;

  @OneToMany(() => Project, p => p.owner)
  projects: Project[];

  @OneToMany(() => Task, t => t.assignee)
  tasks: Task[];
}
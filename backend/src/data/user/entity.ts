import { Project } from "src/data/project/entity";
import { Task } from "src/data/task/entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Project, p => p.owner)
  projects: Project[];

  @OneToMany(() => Task, t => t.assignedTo)
  tasks: Task[];
}
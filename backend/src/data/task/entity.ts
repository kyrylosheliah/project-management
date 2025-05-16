import { Project } from "src/data/project/entity";
import { User } from "src/data/user/entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
};

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Project, p => p.tasks, { onDelete: 'CASCADE'})
  project: Project;

  @ManyToOne(() => User, u => u.tasks, { nullable: true, onDelete: 'SET NULL'})
  assignedTo: User;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;
}
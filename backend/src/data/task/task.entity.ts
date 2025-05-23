import { Exclude } from "class-transformer";
import { Project } from "src/data/project/project.entity";
import { User } from "src/data/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
  @JoinColumn({ name: 'projectId' })
  @Exclude()
  project: Project;

  @Column()
  projectId: number;

  @ManyToOne(() => User, u => u.tasks, { nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({ name: 'assigneeId' })
  @Exclude()
  assignee: User;

  @Column()
  assigneeId: number;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;
}
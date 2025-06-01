import { Exclude } from "class-transformer";
import { Searchable } from "src/common/search/searchable.decorator";
import { Project } from "src/modules/project/project.entity";
import { User } from "src/modules/user/user.entity";
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
  @Searchable({ type: "prefix" })
  title: string;

  @Column({ nullable: true })
  @Searchable({ type: "partial" })
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

  @Column({ nullable: true })
  assigneeId: number | null;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;
}
import { Task } from "src/data/task/task.entity";
import { User } from "src/data/user/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, u => u.projects, { eager: true, onDelete: 'CASCADE' })
  owner: User;

  @OneToMany(() => Task, t => t.project)
  tasks: Task[];
}
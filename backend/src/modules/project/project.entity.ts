import { Exclude } from "class-transformer";
import { Searchable } from "src/common/search/searchable.decorator";
import { Task } from "src/modules/task/task.entity";
import { User } from "src/modules/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Searchable({ type: "prefix" })
  title: string;

  @Column({ nullable: true })
  @Searchable({ type: "partial" })
  description: string;

  @ManyToOne(() => User, u => u.projects, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  @Exclude()
  owner: User;

  @Column()
  ownerId: number;

  @OneToMany(() => Task, t => t.project)
  tasks: Task[];
}
import { Exclude } from "class-transformer";
import { Task } from "src/data/task/task.entity";
import { User } from "src/data/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, u => u.projects, { eager: false, onDelete: 'CASCADE',  })
  @JoinColumn({ name: 'ownerId' })
  @Exclude()
  owner: User;

  @Column()
  ownerId: number;

  @OneToMany(() => Task, t => t.project)
  tasks: Task[];
}
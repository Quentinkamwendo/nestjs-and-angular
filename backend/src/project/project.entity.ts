import { Comment } from 'src/comment/comment.entity';
import { User } from 'src/users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Project')
export class Project {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column()
  project_name: string;

  @Column()
  description: string;

  @Column({ default: '' })
  documentation: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ nullable: true })
  duration: number;

  @Column()
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.project)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.project, { onDelete: 'CASCADE' })
  user: User;
}

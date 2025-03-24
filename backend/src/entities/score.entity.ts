import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Quiz } from './quiz.entity';
import { User } from './user.entity';

@Entity('scores')
export class Score {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.scores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @ManyToOne(() => User, (user) => user.scores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: 0 })
  points: number;

  @Column({ nullable: true })
  position: number;

  @CreateDateColumn()
  created_at: Date;
}

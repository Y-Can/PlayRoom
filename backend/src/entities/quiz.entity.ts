import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { Score } from './score.entity';
import { QuizQuestion } from './quiz-question.entity';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Room, (room) => room.quizzes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @CreateDateColumn()
  started_at: Date;

  @Column({ nullable: true })
  ended_at: Date;

  @OneToMany(() => Score, (score) => score.quiz)
  scores: Score[];

  @OneToMany(() => QuizQuestion, (qq) => qq.quiz)
  quizQuestions: QuizQuestion[];
}

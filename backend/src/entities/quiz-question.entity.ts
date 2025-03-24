import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Quiz } from './quiz.entity';
import { Question } from './question.entity';

@Entity('quiz_questions')
export class QuizQuestion {
  @PrimaryColumn()
  quiz_id: string;

  @PrimaryColumn()
  question_order: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.quizQuestions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  question: string;

  @Column("text", { array: true })
  options: string[];

  @Column()
  answer: string;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Quiz } from './quiz.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 'waiting' })
  status: 'waiting' | 'playing' | 'finished';

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Quiz, (quiz) => quiz.room)
  quizzes: Quiz[];
}

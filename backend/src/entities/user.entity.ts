import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Score } from './score.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  pseudo: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Score, (score) => score.user)
  scores: Score[];
}

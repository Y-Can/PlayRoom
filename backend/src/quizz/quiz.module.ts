/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Module } from '@nestjs/common';
import { QuizGateway } from './quiz.gateway';
import { QuizService } from './quiz.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from '../entities/quiz.entity';
import { Question } from '../entities/question.entity';
import { QuizQuestion } from '../entities/quiz-question.entity';
import { Score } from '../entities/score.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, Question, QuizQuestion, Score]),
  ],
  providers: [QuizGateway, QuizService],
})
export class QuizModule {}

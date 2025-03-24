/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { Question } from '../entities/question.entity';
import { QuizQuestion } from '../entities/quiz-question.entity';
import { Score } from '../entities/score.entity';
import { User } from '../entities/user.entity';
import { Room } from '../entities/room.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepo: Repository<Quiz>,

    @InjectRepository(Question)
    private questionRepo: Repository<Question>,

    @InjectRepository(QuizQuestion)
    private quizQuestionRepo: Repository<QuizQuestion>,

    @InjectRepository(Score)
    private scoreRepo: Repository<Score>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Room)
    private roomRepo: Repository<Room>,
  ) {}

  async startGame(roomId: string): Promise<any> {
    const room = await this.roomRepo.findOne({ where: { id: roomId } });
    if (!room) throw new Error('Room not found');

    const questions = await this.questionRepo.createQueryBuilder()
      .orderBy('RANDOM()')
      .limit(3)
      .getMany();

    const quiz = this.quizRepo.create({ room });
    await this.quizRepo.save(quiz);

    for (let i = 0; i < questions.length; i++) {
      const qq = this.quizQuestionRepo.create({
        quiz,
        question: questions[i],
        question_order: i + 1,
      });
      await this.quizQuestionRepo.save(qq);
    }

    return {
      quizId: quiz.id,
      round: 1,
      totalRounds: questions.length,
      currentQuestion: questions[0],
    };
  }

  async submitAnswer(quizId: string, pseudo: string, answer: string, round: number): Promise<any> {
    const quiz = await this.quizRepo.findOne({ where: { id: quizId }, relations: ['quizQuestions', 'scores'] });
    if (!quiz) throw new Error('Quiz not found');

    const user = await this.userRepo.findOne({ where: { pseudo } });
    if (!user) throw new Error('User not found');

    const questionLink = await this.quizQuestionRepo.findOne({
      where: { quiz: { id: quizId }, question_order: round },
      relations: ['question'],
    });
    if (!questionLink) throw new Error('Question not found');

    const isCorrect = questionLink.question.answer === answer;

    let score = await this.scoreRepo.findOne({ where: { quiz: { id: quizId }, user: { id: user.id } } });
    if (!score) {
      score = this.scoreRepo.create({ quiz, user, points: 0 });
    }

    if (isCorrect) {
      score.points += 1;
      await this.scoreRepo.save(score);
    }

    return {
      correct: isCorrect,
      answer: questionLink.question.answer,
      currentPoints: score.points,
    };
  }

  async getNextQuestion(quizId: string, round: number): Promise<any | null> {
    const next = await this.quizQuestionRepo.findOne({
      where: { quiz: { id: quizId }, question_order: round },
      relations: ['question'],
    });

    if (!next) return null;

    const totalRounds = await this.quizQuestionRepo.count({ where: { quiz: { id: quizId } } });

    return {
      round,
      totalRounds,
      currentQuestion: next.question,
    };
  }

  async endGame(quizId: string): Promise<{ scores: Record<string, number>; winners: string[] }> {
    const scores = await this.scoreRepo.find({
      where: { quiz: { id: quizId } },
      relations: ['user'],
    });

    const result: Record<string, number> = {};
    for (const s of scores) {
      result[s.user.pseudo] = s.points;
    }

    const max = Math.max(...Object.values(result));
    const winners = Object.entries(result)
      .filter(([_, pts]) => pts === max)
      .map(([pseudo]) => pseudo);

    return {
      scores: result,
      winners,
    };
  }
}

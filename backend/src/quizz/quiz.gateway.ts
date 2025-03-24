/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QuizService } from './quiz.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class QuizGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly quizService: QuizService) {}

  @SubscribeMessage('startGame')
  async handleStartGame(@MessageBody() data: { roomId: string }) {
    const gameState = await this.quizService.startGame(data.roomId);

    this.server.to(data.roomId).emit('nextQuestion', {
      quizId: gameState.quizId,
      round: gameState.round,
      totalRounds: gameState.totalRounds,
      currentQuestion: gameState.currentQuestion,
    });
  }

  @SubscribeMessage('answer')
  async handleAnswer(
    @MessageBody()
    data: {
      quizId: string;
      pseudo: string;
      answer: string;
      round: number;
      roomId: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.quizService.submitAnswer(
      data.quizId,
      data.pseudo,
      data.answer,
      data.round,
    );

    this.server.to(data.roomId).emit('scoreUpdate', {
      pseudo: data.pseudo,
      correct: result.correct,
      answer: result.answer,
      currentPoints: result.currentPoints,
    });

    setTimeout(async () => {
      const next = await this.quizService.getNextQuestion(data.quizId, data.round + 1);
      if (next) {
        this.server.to(data.roomId).emit('nextQuestion', {
          quizId: data.quizId,
          round: next.round,
          totalRounds: next.totalRounds,
          currentQuestion: next.currentQuestion,
        });
      } else {
        const results = await this.quizService.endGame(data.quizId);
        this.server.to(data.roomId).emit('gameOver', results);
      }
    }, 3000);
  }
}

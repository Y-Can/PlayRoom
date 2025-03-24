/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module'
import { ChatModule } from './chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Room } from './entities/room.entity';
import { Quiz } from './entities/quiz.entity';
import { Question } from './entities/question.entity';
import { QuizQuestion } from './entities/quiz-question.entity';
import { Score } from './entities/score.entity';
import 'dotenv/config';

@Module({
  imports: [AuthModule, RoomsModule, ChatModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false, // false en prod
      ssl: {
        rejectUnauthorized: false, // 🔥 Obligatoire pour Clever Cloud
      },
      entities: [User, Room, Quiz, Question, QuizQuestion, Score],
    }),
    TypeOrmModule.forFeature([User, Room, Quiz, Question, QuizQuestion, Score]),
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}

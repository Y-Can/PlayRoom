/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module'
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [AuthModule, RoomsModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}

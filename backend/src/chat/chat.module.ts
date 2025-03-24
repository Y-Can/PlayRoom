/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}

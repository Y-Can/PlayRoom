/* eslint-disable prettier/prettier */


import { Injectable } from '@nestjs/common';

interface ChatMessage {
  roomId: string;
  message: string;
  pseudo: string;
  avatar: string;
  timestamp: number;
}

@Injectable()
export class ChatService {
  private messages: ChatMessage[] = [];

  saveMessage(msg: ChatMessage) {
    const fullMessage = { ...msg, timestamp: Date.now() };
    this.messages.push(fullMessage);
    return fullMessage;
  }

  getMessagesForRoom(roomId: string): ChatMessage[] {
    return this.messages.filter((m) => m.roomId === roomId);
  }
}

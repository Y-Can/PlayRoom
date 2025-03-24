/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { ChatService } from './chat.service';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class ChatGateway {
    @WebSocketServer()
    server: Server;
  
    constructor(private readonly chatService: ChatService) {}
  
    @SubscribeMessage('chatMessage')
    handleChatMessage(
      @MessageBody()
      data: { roomId: string; message: string; pseudo: string; avatar: string },
      @ConnectedSocket() client: Socket,
    ) {
      const { roomId, message, pseudo, avatar } = data;
  
      const saved = this.chatService.saveMessage({
          roomId, message, pseudo, avatar,
          timestamp: 0
      });
      
      this.server.to(roomId).emit('newMessage', saved);
    }
  }
  
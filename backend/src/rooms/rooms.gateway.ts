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
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { RoomsService } from './rooms.service';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    constructor(private readonly roomsService: RoomsService) {}
  
    async handleConnection(client: Socket) {
      // Optionnel : log ou auth
    }
  
    async handleDisconnect(client: Socket) {
      const room = this.roomsService.removeClient(client.id);
      if (room) {
        this.server.to(room).emit('userLeft', { clientId: client.id });
      }
    }
  
    @SubscribeMessage('joinRoom')
    handleJoinRoom(
      @MessageBody() data: { roomId: string; pseudo: string; avatar: string },
      @ConnectedSocket() client: Socket,
    ) {
      const { roomId, pseudo, avatar } = data;
  
      client.join(roomId);
      this.roomsService.addClientToRoom(client.id, roomId, pseudo, avatar);
  
      const users = this.roomsService.getUsersInRoom(roomId);
  
      this.server.to(roomId).emit('roomUpdate', { users });
    }
  }
  
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

interface RoomUser {
  clientId: string;
  pseudo: string;
  avatar: string;
}

@Injectable()
export class RoomsService {
  private rooms: Record<string, RoomUser[]> = {};

  addClientToRoom(clientId: string, roomId: string, pseudo: string, avatar: string) {
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = [];
    }

    this.rooms[roomId].push({ clientId, pseudo, avatar });
  }

  removeClient(clientId: string): string | null {
    for (const roomId in this.rooms) {
      const room = this.rooms[roomId];
      const index = room.findIndex((user) => user.clientId === clientId);
      if (index !== -1) {
        room.splice(index, 1);
        return roomId;
      }
    }
    return null;
  }

  getUsersInRoom(roomId: string): RoomUser[] {
    return this.rooms[roomId] || [];
  }
}

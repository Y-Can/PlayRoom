/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const adjectives = ['Cool', 'Dark', 'Swift', 'Fire', 'Silent', 'Epic'];
const animals = ['Panther', 'Wolf', 'Eagle', 'Ninja', 'Tiger', 'Shadow'];

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateGuest() {
    const pseudo =
      adjectives[Math.floor(Math.random() * adjectives.length)] +
      animals[Math.floor(Math.random() * animals.length)] +
      Math.floor(Math.random() * 100);

    const avatar = `https://api.dicebear.com/6.x/bottts/svg?seed=${pseudo}`;

    const payload = { pseudo, avatar };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: payload,
    };
  }
}

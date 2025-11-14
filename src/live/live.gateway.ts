import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { RouletteService } from '../roulette/roulette.service';
import { UserService } from '../modules/user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class LiveGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<number, { socketId: string; username: string }>();

  constructor(
    private readonly rouletteService: RouletteService,
    private readonly usersService: UserService,
  ) {}

  // userId -> socketId 

  

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
      }
      const decoded = jwt.verify(token, jwtSecret) as any;

      const userId = decoded.sub;
      const username = decoded.username;

      this.onlineUsers.set(userId, {  
          socketId: client.id,
          username: username,
      });

      this.broadcastOnlineUsers();
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, data] of this.onlineUsers) {
      if (data.socketId === client.id) {
        this.onlineUsers.delete(userId);
        break;
      }
    }

    this.broadcastOnlineUsers();
  }

  broadcastOnlineUsers() {
     const users = Array.from(this.onlineUsers.entries()).map(
    ([userId, data]) => ({
      id: userId,
      username: data.username,
    }),
  );
    this.server.emit('online-users', {
      count: this.onlineUsers.size,
      users: users,
    });
  }

  // ROOM CONTROL
  @SubscribeMessage('join-room')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: { room: string }) {
    client.join(payload.room);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: { room: string }) {
    client.leave(payload.room);
  }

  // Betting on roulette
  @SubscribeMessage('place-bet')
  async handlePlaceBet(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string; bet: any }, // bet validated in service
  ) {
    try {
      const tokenHeader = client.handshake.auth?.token || client.handshake.headers.authorization;
      const token = typeof tokenHeader === 'string' ? tokenHeader.replace('Bearer ', '') : null;
      const secret = process.env.JWT_SECRET;
      const decoded = jwt.verify(token!, secret!) as any;
      const userId = decoded.sub;

      const betResult = await this.rouletteService.placeBet(userId, payload.room, payload.bet);
      // emit confirmation to user only
      client.emit('bet-placed', betResult);
      // broadcast to room about new bet (optional)
      this.server.to(payload.room).emit('bet-update', { userId, bet: betResult });
    } catch (err) {
      client.emit('error', { message: err.message });
    }
  }

  // admin trigger to force spin (optional)
  @SubscribeMessage('force-spin')
  async handleForceSpin(@ConnectedSocket() client: Socket, @MessageBody() payload: { room: string }) {
    // ensure client is admin (validate token and role)
    try {
      const tokenHeader = client.handshake.auth?.token || client.handshake.headers.authorization;
      const token = typeof tokenHeader === 'string' ? tokenHeader.replace('Bearer ', '') : null;
      const secret = process.env.JWT_SECRET;
      const decoded = jwt.verify(token!, secret!) as any;
      const userId = decoded.sub;
      const user = await this.usersService.findById(userId);
      if (user?.role !== 'ADMIN') throw new Error('Forbidden');
      const result = await this.rouletteService.spinNow(payload.room);
      this.server.to(payload.room).emit('spin-result', result);
    } catch (err) {
      client.emit('error', { message: err.message });
    }
  }
}


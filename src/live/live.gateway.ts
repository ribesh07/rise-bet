// src/roulette/live.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { RouletteService } from '../roulette/roulette.service';
import { UserService } from '../modules/user/user.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class LiveGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<number, { socketId: string; username: string }>();

  constructor(
    private readonly rouletteService: RouletteService,
    private readonly usersService: UserService,
  ) {}

  afterInit(server: Server) {
    // pass server to service
    this.rouletteService.setServer(server);
    console.log('LiveGateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      // prefer auth token (socket.io client sends via `auth`)
      const tokenFromAuth = client.handshake.auth?.token;
      // fallback to header (rarely used)
      const tokenFromHeader = (client.handshake.headers?.authorization as string | undefined)?.replace('Bearer ', '');
      const token = tokenFromAuth || tokenFromHeader;

      if (!token) {
        console.log('Connection rejected: no token', client.id);
        client.disconnect();
        return;
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('JWT_SECRET not defined');
        client.disconnect();
        return;
      }

      const decoded = jwt.verify(token, jwtSecret) as any;
      const userId = decoded.sub;
      const username = decoded.username ?? decoded.email ?? `user${userId}`;

      this.onlineUsers.set(userId, { socketId: client.id, username });
      console.log(`User connected: ${username} (${userId}) socket=${client.id}`);
      this.broadcastOnlineUsers();
    } catch (err) {
      console.log('Connection error, disconnecting', err?.message ?? err);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    // remove from online map
    for (const [userId, data] of this.onlineUsers) {
      if (data.socketId === client.id) {
        this.onlineUsers.delete(userId);
        console.log(`User disconnected: ${data.username} (${userId}) socket=${client.id}`);
        break;
      }
    }
    this.broadcastOnlineUsers();
  }

  broadcastOnlineUsers() {
    const users = Array.from(this.onlineUsers.entries()).map(([userId, data]) => ({
      id: userId,
      username: data.username,
    }));
    this.server.emit('online-users', { count: users.length, users });
  }

  // ROOM CONTROL
  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string },
  ) {
    try {
      client.join(payload.room);
      console.log(`Client ${client.id} requested join-room ${payload.room}`);

        // ⭐ CREATE TABLE LOOP IF NOT EXISTS
    this.rouletteService.createTable(payload.room);

      // log how many sockets in the room now
      const sockets = await this.server.in(payload.room).allSockets();
      const count = sockets ? sockets.size : 0;
      console.log(`Room ${payload.room} size after join: ${count}`);

      // try to extract user info (from auth or headers)
      const tokenHeader = client.handshake.auth?.token || (client.handshake.headers?.authorization as string | undefined);
      const token = typeof tokenHeader === 'string' ? tokenHeader.replace('Bearer ', '') : null;

      if (!token) {
        console.log('join-room: no token, skipping addPlayerToMatch');
        return { ok: false };
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const userId = decoded.sub;
      const username = decoded.username ?? decoded.email ?? `user${userId}`;

      // persistence: add player to match table
      await this.rouletteService.addPlayerToMatch(payload.room, { userId, username });

      // notify room someone joined
      this.server.to(payload.room).emit('player-joined', { userId, username });

      return { ok: true };
    } catch (err) {
      console.error('join-room error', err?.message ?? err);
      client.emit('error', { message: 'join-room failed' });
      return { ok: false, error: err?.message ?? String(err) };
    }
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: { room: string }) {
    client.leave(payload.room);
    console.log(`Client ${client.id} left room ${payload.room}`);
    // optionally remove player from match table
    // await this.rouletteService.removePlayerFromMatch(payload.room, userId);
    return { ok: true };
  }

  // Betting on roulette
  @SubscribeMessage('place-bet')
  async handlePlaceBet(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string; bet: any },
  ) {
    try {
      const tokenHeader = client.handshake.auth?.token || (client.handshake.headers?.authorization as string | undefined);
      const token = typeof tokenHeader === 'string' ? tokenHeader.replace('Bearer ', '') : null;
      if (!token) throw new Error('Unauthenticated');

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const userId = Number(decoded.sub);
      console.log(decoded);
      console.log(`Placing bet for user ${userId} in room ${payload.room}`);


      const match = await this.rouletteService.getActiveMatch(payload.room);
      // const user = await this.usersService.findById(userId);

      // if (!user) {
      //       throw new Error(`User with id ${userId} does NOT exist`);
      //     }
      const betEntry = await this.rouletteService.createBet({
        matchId: match.id,
        userId,
        room: payload.room,
        payload: payload.bet,
        amount: payload.bet.amount,
      });

      client.emit('bet-placed', betEntry);
      this.server.to(payload.room).emit('bet-update', { userId, bet: betEntry });

      return { ok: true };
    } catch (err) {
      console.error('place-bet error', err?.message ?? err);
      client.emit('error', { message: err?.message ?? String(err) });
      return { ok: false, error: err?.message ?? String(err) };
    }
  }

  // admin trigger to force spin (optional)
  @SubscribeMessage('force-spin')
  async handleForceSpin(@ConnectedSocket() client: Socket, @MessageBody() payload: { room: string }) {
    try {
      const tokenHeader = client.handshake.auth?.token || (client.handshake.headers?.authorization as string | undefined);
      const token = typeof tokenHeader === 'string' ? tokenHeader.replace('Bearer ', '') : null;
      if (!token) throw new Error('Unauthenticated');

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const userId = decoded.sub;
      const user = await this.usersService.findById(userId);
      if (!user || user.role !== 'ADMIN') throw new Error('Forbidden');

      // before spin: report how many sockets are in the room
      const socketsBefore = await this.server.in(payload.room).allSockets();
      console.log(`Force spin requested by admin ${userId} for ${payload.room}. sockets in room: ${socketsBefore.size}`);

      const result = await this.rouletteService.forceSpin(payload.room);

      // after resolving, log and broadcast
      const socketsAfter = await this.server.in(payload.room).allSockets();
      console.log(`After resolve, sockets in room ${payload.room}: ${socketsAfter.size}`);

      this.server.to(payload.room).emit('spin-result', result);
      return { ok: true, result };
    } catch (err) {
      console.error('force-spin error', err?.message ?? err);
      client.emit('error', { message: err?.message ?? String(err) });
      return { ok: false, error: err?.message ?? String(err) };
    }
  }
}

import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { SocketService } from "src/socket/socket.service";
// import { Server, Socket } from 'socket.io';

@WebSocketGateway(
    { namespace: '/crash' ,  cors: { origin: '*' }},
)
export class CrashGateway {
  @WebSocketServer() server;

  constructor(private socketService: SocketService) {}

  afterInit() {
    this.socketService.register(this.server);
  }

  @SubscribeMessage('place-bet')
  handleBet(@MessageBody() data) {
    // Do crash logic...

    // Notify other gateways
    this.socketService.broadcast('update', {
      userId: data.userId,
      newBalance: 500,
    });
  }
}

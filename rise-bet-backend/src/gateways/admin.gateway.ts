import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { SocketService } from "src/socket/socket.service";

@WebSocketGateway({ namespace: '/admin' ,  cors: { origin: '*' }},)
export class AdminGateway {
  @WebSocketServer() server;

  constructor(private socketService: SocketService) {}

  afterInit() {
    this.socketService.register(this.server);
  }

  sendGlobalNotice(msg: string) {
    this.socketService.broadcast('global-notice', { msg });
  }
}

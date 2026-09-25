import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketService {
  private servers: any[] = [];

  register(server: any) {
    this.servers.push(server);
  }

  // Broadcast to ALL gateways
  broadcast(event: string, data: any) {
    for (const server of this.servers) {
      server.emit(event, data);
    }
  }

  // Broadcast to a specific namespace
  broadcastTo(namespace: string, event: string, data: any) {
    const server = this.servers.find(s => s._opts?.namespace === namespace);
    server?.emit(event, data);
  }
}

import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class VideoChatGateway {
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string): void {
    client.join(room);
    this.server.to(room).emit('userJoined', client.id);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string): void {
    client.leave(room);
    this.server.to(room).emit('userLeft', client.id);
  }

  @SubscribeMessage('offer')
  handleOffer(client: Socket, payload: any): void {
    this.server.to(payload.target).emit('offer', payload);
  }

  @SubscribeMessage('answer')
  handleAnswer(client: Socket, payload: any): void {
    this.server.to(payload.target).emit('answer', payload);
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(client: Socket, payload: any): void {
    this.server.to(payload.target).emit('ice-candidate', payload);
  }
}

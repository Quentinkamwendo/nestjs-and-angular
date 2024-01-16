import { Injectable } from '@angular/core';
// import { Socket, io } from 'socket.io-client';
import { Socket } from 'ngx-socket-io';
// import SimplePeer from 'simple-peer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoChatService {
  // private socket: Socket;

  constructor(private socket: Socket) {
    // this.socket = io('http://localhost:3000');
  }

  joinRoom(room: string): void {
    this.socket.emit('joinRoom', room);
  }

  leaveRoom(room: string): void {
    this.socket.emit('leaveRoom', room);
  }

  sendOffer(offer: any): void {
    this.socket.emit('offer', offer);
  }

  sendAnswer(answer: any): void {
    this.socket.emit('answer', answer);
  }

  sendIceCandidate(candidate: any, target: string): void {
    this.socket.emit('offer', {candidate, target});
  }

  onUserJoined(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('userJoined', (userId: string) => {
        observer.next(userId);
      });
    });
  }

  onUserLeft(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('userLeft', (userId: string) => {
        observer.next(userId);
      });
    });
  }

  onOffer(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('offer', (offer: any) => {
        observer.next(offer);
      });
    });
  }
onAnswer(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('answer', (answer: any) => {
        observer.next(answer);
      });
    });
  }

  onIceCandidate(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('ice-candidate', (candidate: any) => {
        observer.next(candidate);
      });
    });
  }

}

import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import {Subject, Observable} from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { VideoChatService } from './video-chat.service';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as SimplePeer from 'simple-peer';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css']
})
export class VideoChatComponent implements OnInit, OnDestroy {
  roomForm!: FormGroup;
  localStream?: MediaStream;
  users: {id: string, videoStream: MediaStream}[] = [];
  public webCamImage?: WebcamImage;
  public errors: WebcamInitError[] = [];
  private unsubscribe$ = new Subject<void>();
  @ViewChild('localVideo') localVideo!: ElementRef;

  private peerConnection?: SimplePeer.Instance;
  public remotePeers: SimplePeer.Instance[] = [];

  constructor(
    private videoChatService: VideoChatService,
    private fb: FormBuilder
    ) {}

  ngOnInit(): void {
    this.roomForm = this.fb.group({
      roomName: [''],
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
      // Display local video stream
      this.localVideo.nativeElement.srcObject = stream;
      this.peerConnection?.addStream(stream);

      // Handle incoming stream from other users
      this.peerConnection?.on('stream', (remoteStream) => {
        this.remotePeers.push({ stream: remoteStream } as unknown as SimplePeer.Instance);
      });
    })
    .catch((error) => console.error('Error accessing media devices:', error))

    this.videoChatService
    .onUserJoined()
    .pipe(takeUntil(this.unsubscribe$)).subscribe((userId: string) => {
      const videoStream = this.getVideoStream();
      this.users.push({id: userId, videoStream});
    });

    this.videoChatService
    .onUserLeft()
    .pipe(takeUntil(this.unsubscribe$)).subscribe((userId: string) => {
      this.users = this.users.filter((user) => user.id !== userId);
    });
    // Add similar subscription handling for offer, answer, and ice-candidate
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  joinRoom() {
    const roomName = this.roomForm.get('roomName')?.value;
    if (roomName) {
      this.videoChatService.joinRoom(roomName);
    }
  }

  leaveRoom() {
    const roomName = this.roomForm.get('roomName')?.value;
    this.videoChatService.leaveRoom(roomName);
    this.users.forEach((user) => {
      user.videoStream.getTracks().forEach((track) => track.stop());
    });
    this.users = [];
  }

  private getVideoStream(): MediaStream {
    // use ngx-webcam to access the user's webcam
    return new MediaStream();
  }

  handleImage(webCamImage: WebcamImage): void {
    console.info('Saved webcam Image', webCamImage);
    this.webCamImage = webCamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.unsubscribe$.asObservable();
  }

  triggerSnapshot(): void {
    this.unsubscribe$.next();
  }

}

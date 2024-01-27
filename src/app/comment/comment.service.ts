import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from './comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  createComment(comment: Comment) {
    return this.http.post<Comment>('api/comment', comment)
  }

  getComments() {
    return this.http.get<Comment[]>('api/comment');
  }

  getCommentById(id: string) {
    return this.http.get<Comment[]>(`api/comment/${id}`);
  }

  updateComment(id: string, comment: Comment) {
    return this.http.patch<Comment>(`api/comment/${id}`, comment);
  }

  deleteComment(id: string) {
    return this.http.delete(`api/comment/${id}`);
  }

}

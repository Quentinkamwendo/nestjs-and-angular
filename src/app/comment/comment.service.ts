import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from './comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  createComment(comment: Comment, projectId: string) {
    return this.http.post<Comment>(`api/comment/${projectId}`, comment)
  }

  getComments(projectId: string) {
    return this.http.get<Comment[]>(`api/comment/${projectId}`);
  }

  getCommentById(projectId: string, id: string) {
    return this.http.get<Comment[]>(`api/comment/${projectId}/${id}`);
  }

  updateComment(projectId: string, id: string, comment: Comment) {
    return this.http.patch<Comment>(`api/comment/${projectId}/${id}`, comment);
  }

  deleteComment(projectId: string, id: string) {
    return this.http.delete(`api/comment/${projectId}/${id}`);
  }

}

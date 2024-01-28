import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from './comment.model';
import { CommentService } from './comment.service';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  commentForm!: FormGroup;
  comments: any[] = [];
  title!: string;
  id?: string;
  projectId!: string;

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required]],
    });

    // Extract projectId from the route parameters
    this.route.params.subscribe((params) => {
      this.projectId = params['projectId'];
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.title = 'Comments';

    this.commentService
      .getComments(this.projectId)
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.comments = response;
        },
        error: (error) => {
          this._snackBar.open(error, 'close', { duration: 5000 });
        },
      });

    if (this.id) {
      this.title = 'Update Comments';
      this.commentService
        .getCommentById(this.projectId, this.id)
        .pipe(first())
        .subscribe((x) => {
          this.commentForm.patchValue(x);
        });
    }
  }

  get f() {
    return this.commentForm.controls;
  }

  onSubmit() {
    if (this.commentForm.invalid) {
      return;
    }
    this.saveComment()
      .pipe(first())
      .subscribe({
        next: () => {
          this._snackBar.open('comment created', 'close', { duration: 5000 });
          this.commentForm.reset();
          this.loadComments();
        },
        error: (error) => {
          this._snackBar.open(error, 'close', { duration: 5000 });
        },
      });
  }

  deleteComment(projectId: string, id: string) {
    this.commentService
      .deleteComment(projectId, id)
      .pipe(first())
      .subscribe(
        () =>
          (this.comments = this.comments.filter(
            (x: { id: string }) => x.id !== id
          ))
      );
  }

  private loadComments() {
    this.commentService
      .getComments(this.projectId)
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.comments = response;
        },
        error: (error) => {
          this._snackBar.open(error, 'close', { duration: 5000 });
        },
      });
  }

  private saveComment() {
    const commentData = {
      ...this.commentForm.value,
      projectId: this.projectId,
    };
    // create or update user based on id param
    return this.id
      ? this.commentService.updateComment(
          this.projectId,
          this.id!,
          this.commentForm.value
        )
      : this.commentService.createComment(
          this.commentForm.value,
          this.projectId
        );
  }
}

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
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  commentForm!: FormGroup;
  comments: Comment[] = [];
  title!: string;
  id?: string;

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.title = 'Comments';
    this.commentService.getComments().pipe(first()).subscribe({
      next: (response) => {
        this.comments = response;
      },
      error: error => {
        this._snackBar.open(error, 'close', {duration: 5000});
      }
    })
    if (this.id) {
      this.title = 'Update Comments';
      this.commentService.getCommentById(this.id).pipe(first()).subscribe((x) => {
        this.commentForm.patchValue(x);
      })
    }
  }

  get f() { return this.commentForm.controls; }

  onSubmit() {
    if (this.commentForm.invalid) {
      return;
    }
    this.saveComment().pipe(first()).subscribe({
      next: () => {
        this._snackBar.open('comment created', 'close', {duration: 5000})
      },
      error: error => {
        this._snackBar.open(error, 'close', {duration: 5000});
      }
    })
  }

  private saveComment() {
    // create or update user based on id param
    return this.id
      ? this.commentService.updateComment(this.id!, this.commentForm.value)
      : this.commentService.createComment(this.commentForm.value)
  }
}

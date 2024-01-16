import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';

@Controller('rest/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  createComment(
    @Param('projectId') projectId: number,
    @Body() comment: Comment,
  ): Promise<Comment> {
    return this.commentService.createComment(projectId, comment);
  }
}

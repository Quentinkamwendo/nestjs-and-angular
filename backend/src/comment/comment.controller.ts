import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';

@Controller('api')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('comment')
  getComments() {
    return this.commentService.getComments();
  }

  @Get('comment/:id')
  getComment(@Param('id') id: string) {
    return this.commentService.getCommentById(id);
  }

  @Post('comment')
  createComment(@Request() req, @Body() comment: Comment): Promise<Comment> {
    const projectId = req.project;
    return this.commentService.createComment(projectId, comment);
  }

  @Patch('comment/:id')
  updateComment(@Param('id') id: string, @Body() comment: Comment) {
    return this.commentService.updateComment(id, comment);
  }

  @Delete('comment/:id')
  deleteComment(@Param('id') id: string) {
    return this.commentService.deleteComment(id);
  }
}

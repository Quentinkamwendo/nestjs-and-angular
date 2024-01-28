import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':projectId')
  getComments(@Param('projectId') projectId: string) {
    return this.commentService.getComments(projectId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':projectId/:id')
  getComment(@Param('projectId') projectId: string, @Param('id') id: string) {
    return this.commentService.getCommentById(projectId, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':projectId')
  createComment(
    @Param('projectId') projectId: string,
    @Body() comment: Comment,
    @Request() req,
  ): Promise<Comment> {
    const owner = req.user.userId;
    return this.commentService.createComment(projectId, comment, owner);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':projectId/:id')
  updateComment(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() comment: Comment,
  ) {
    return this.commentService.updateComment(projectId, id, comment);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':projectId/:id')
  deleteComment(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.commentService.deleteComment(projectId, id);
  }
}

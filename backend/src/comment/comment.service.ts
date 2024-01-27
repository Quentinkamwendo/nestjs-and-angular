import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  createComment(projectId, comment: Comment): Promise<Comment> {
    comment.project = { id: projectId } as any;
    return this.commentRepository.save({
      content: comment.content,
      project: projectId,
    });
  }

  async getComments() {
    return await this.commentRepository.find();
  }

  async getCommentById(id: string) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async updateComment(id: string, comment: Comment) {
    return await this.commentRepository.update(id, comment);
  }

  async deleteComment(id: string) {
    return this.commentRepository.delete(id);
  }
}

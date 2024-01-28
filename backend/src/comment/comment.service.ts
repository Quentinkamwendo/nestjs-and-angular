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

  createComment(projectId: string, comment: Comment, owner): Promise<Comment> {
    comment.project = { id: projectId } as any;
    comment.user = owner;
    return this.commentRepository.save(comment);
  }

  async getComments(projectId: string) {
    return await this.commentRepository.find({
      where: { project: { id: projectId } },
      relations: ['project', 'user'],
    });
  }

  async getCommentById(projectId: string, id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id, project: { id: projectId } },
      relations: ['project', 'user'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async updateComment(projectId: string, id: string, comment: Comment) {
    await this.commentRepository.update(
      { id, project: { id: projectId } },
      comment,
    );
    return this.commentRepository.findOne({
      where: { id, project: { id: projectId } },
      relations: ['project', 'user'],
    });
  }

  async deleteComment(projectId: string, id: string) {
    return this.commentRepository.delete({ id, project: { id: projectId } });
  }
}

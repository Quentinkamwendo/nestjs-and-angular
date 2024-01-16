import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  createComment(projectId: number, comment: Comment): Promise<Comment> {
    comment.project = { id: projectId } as any;
    return this.commentRepository.save(comment);
  }
}

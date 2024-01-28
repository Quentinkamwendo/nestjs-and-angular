import { Comment } from '../comment/comment.model';

export interface Project {
  id?: string;
  project_name: string;
  start_date: Date;
  end_date: Date;
  description: string;
  documentation: File;
  image: File;
  comments?: Comment[];
  user?: {
    username?: string;
    email?: string;
  };
  // video: File;
}

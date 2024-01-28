export interface Comment {
  id?: string;
  content: string;
  projectId?: string;
  user?: {
    username?: string;
    email?: string;
  }
  project?: {
    id: string;
  }
}

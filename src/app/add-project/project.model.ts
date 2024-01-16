export interface Project {
  id?: string;
  project_name: string;
  start_date: Date;
  end_date: Date;
  description: string;
  documentation: File;
  image: File;
  // video: File;
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from './project.model';

@Injectable({
  providedIn: 'root',
})
export class AddProjectService {
  constructor(private http: HttpClient) {}

  createProject(project: FormData) {
    return this.http.post<Project>('api/project', project);
  }

  getProjects(page: number, limit: number) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<any>('api/project', { params });
  }

  getProjectById(id: string) {
    return this.http.get<Project[]>(`api/project/${id}`);
  }

  // updateProject(id: string, project: Project): Observable<Project> {
  //   return this.http.patch<Project>(`api/project/${id}`, project)
  // }
  updateProject(id: string, project: FormData): Observable<Project> {
    return this.http.patch<Project>(`api/project/${id}`, project);
  }

  deleteProject(id: string) {
    return this.http.delete(`api/project/${id}`);
  }
}

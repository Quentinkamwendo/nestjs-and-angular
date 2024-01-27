import { Component, OnInit, inject } from '@angular/core';
import { AddProjectService } from '../add-project/add-project.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {
  projects: any[] = [];
  constructor(
    private addProjectService: AddProjectService,
    ) {}
  ngOnInit(): void {
    this.addProjectService.getProjects().pipe(first()).subscribe((response) => {
      this.projects = response;
    })
  }

  deleteProject(id: string) {
    this.addProjectService.deleteProject(id)
    .pipe(first())
      .subscribe(() => this.projects = this.projects!.filter((x: { id: string; }) => x.id !== id));
  }

}

import { Component, OnInit } from '@angular/core';
import { AddProjectService } from '../add-project/add-project.service';
import { first } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {
  projects: any[] = [];
  constructor(
    private addProjectService: AddProjectService,
    private breakPointObserver: BreakpointObserver
    ) {}
  ngOnInit(): void {
    this.addProjectService.getProjects().pipe(first()).subscribe((response) => {
      this.projects = response;
    })
  }

  getGridColumns(): number {
    return this.breakPointObserver.isMatched(Breakpoints.Handset) ? 1 : 3;
  }

  deleteProject(id: string) {
    this.addProjectService.deleteProject(id)
    .pipe(first())
      .subscribe(() => this.projects = this.projects!.filter((x: { id: string; }) => x.id !== id));
  }

}

import { Component, OnInit, inject } from '@angular/core';
import { AddProjectService } from '../add-project/add-project.service';
import { first, map } from 'rxjs/operators';
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
    ) {}
  ngOnInit(): void {
    this.addProjectService.getProjects().pipe(first()).subscribe((response) => {
      this.projects = response;
    })
  }

  private breakpointObserver = inject(BreakpointObserver);


  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { cols: 1, rows: 1 },
          { cols: 1, rows: 1 },
          // { cols: 1, rows: 1 },
          // { cols: 1, rows: 1 }
        ];
      }

      return [
        { cols: 1, rows: 1 },
        { cols: 1, rows: 1 },
        // { cols: 1, rows: 2 },
        // { cols: 1, rows: 1 }
      ];
    })
  );


  deleteProject(id: string) {
    this.addProjectService.deleteProject(id)
    .pipe(first())
      .subscribe(() => this.projects = this.projects!.filter((x: { id: string; }) => x.id !== id));
  }

}

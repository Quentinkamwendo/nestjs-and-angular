import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { AddProjectService } from '../add-project/add-project.service';
import { first } from 'rxjs/operators';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {
  projects: any[] = [];
  currentPage: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 3;
  pageIndex = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private addProjectService: AddProjectService,
    ) {}
  ngOnInit(): void {
    this.loadProjects(this.currentPage, this.itemsPerPage);
  }

  loadProjects(page: number, limit: number) {
    this.addProjectService.getProjects(page, limit).pipe(first()).subscribe((response) => {
      this.projects = response.items;
      this.totalItems = response.meta.totalItems;
      this.itemsPerPage = response.meta.itemsPerPage;
      this.currentPage = response.meta.currentPage;
    });
  }
  onPageChange(event: PageEvent) {
    // this.currentPage = event.pageIndex + 1;
    // this.pageIndex = event.pageIndex;
    // this.itemsPerPage = event.pageSize;
    this.loadProjects(event.pageIndex + 1, event.pageSize)
  }

  deleteProject(id: string) {
    this.addProjectService.deleteProject(id)
    .pipe(first())
      .subscribe(() => this.projects = this.projects!.filter((x: { id: string; }) => x.id !== id));
  }

}

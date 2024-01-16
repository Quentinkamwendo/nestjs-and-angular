import { Component, OnInit } from '@angular/core';
import { AddProjectService } from './add-project.service';
import { Project } from './project.model';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  projectForm!: FormGroup;
  projects: Project[] = [];
  title!: string;
  id?: string;
  // selectedProject!: Project;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private projectService: AddProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this.projectForm = this.fb.group({
      project_name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      start_date: [''],
      end_date: [''],
      documentation: [null, [Validators.required]],
      image: [null],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.title = 'Add Project';
    if (this.id) {
      // edit mode
      this.title = 'Edit Project';
      this.projectService.getProjectById(this.id)
        .pipe(first())
        .subscribe(x => {
          this.projectForm.patchValue(x);
        });
    }

    // this.loadProjects();
  }

  get myForm() {
    return this.projectForm.controls
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const projectData: Project = this.projectForm.value;
      const formData = new FormData();
      formData.append('project_name', projectData.project_name);
      formData.append('description', projectData.description);
      formData.append('start_date', projectData.start_date.toDateString());
      formData.append('end_date', projectData.end_date.toDateString());
      formData.append('documentation', projectData.documentation);
      formData.append('image', projectData.image);

      if (this.id) {
        // Update existing project
        this.projectService.updateProject(this.id, formData)
          .subscribe({
            next: (response) => {
              this._snackBar.open(`Project ${response.project_name} updated`, 'close', { duration: 5000 });
              this.projectForm.reset();
              this.loadProjects();
            },
            error: error => {
              this._snackBar.open(error, 'close', { duration: 5000 });
              this.submitting = false;
            }
          });
      } else {
        // Create a new project
        this.projectService.createProject(formData)
          .pipe(first())
          .subscribe({
            next: (response) => {
              this._snackBar.open(`Project ${response.project_name} created`, 'close', { duration: 5000 });
              this.projectForm.reset();
              this.loadProjects();
              console.log(response);

              this.router.navigateByUrl('/dashboard');
            },
            error: error => {
              this._snackBar.open(error, 'close', { duration: 5000 });
              this.submitting = false;
            }
          });
      }
    }
  }

  loadProjects() {
    this.projectService.getProjects().pipe(first()).subscribe((projects: Project[]) => {
      this.projects = projects;
    });
  }

  onFileSelected(event: Event, field: string) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files![0];
      this.projectForm.get(field)?.setValue(file);
    }
  }
}




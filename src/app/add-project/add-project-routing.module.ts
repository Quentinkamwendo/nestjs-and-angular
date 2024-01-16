import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProjectComponent } from './add-project.component';

const routes: Routes = [
  {path: '', component: AddProjectComponent},
  {path: ':id', component: AddProjectComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddProjectRoutingModule { }

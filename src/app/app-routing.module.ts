import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_helpers/auth.guard';
import { ProjectViewComponent } from './project-view/project-view.component';
import { VideoChatComponent } from './video-chat/video-chat.component';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const addProjectModule = () => import('./add-project/add-project.module').then(x => x.AddProjectModule)
const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'users', loadChildren: usersModule, canActivate: [AuthGuard]},
  {path: 'account', loadChildren: accountModule},
  {path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'project', loadChildren: addProjectModule, canActivate: [AuthGuard]},
  {path: 'projectView', component: ProjectViewComponent, canActivate: [AuthGuard]},
  {path: 'videoChat', component: VideoChatComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Routes } from '@angular/router';
import { AppLayout } from 'src/app/app-layout/app-layout';
import { AuthGuardChildFunction } from 'src/app/core/service/auth-guard.service';
import { Login } from 'src/app/login/login';

import { PostForm } from './cooperation/web-board/post/post-form';
import { PostView } from './cooperation/web-board/post/post-view';
import { Oauth2LoginSuccess } from './login/oauth2-login-success';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login/:id', component: Login },
  {path: 'oauth2/:id', component: Oauth2LoginSuccess },
  {path: 'login', component: Login },
  //{path: 'login2', component: Login2Component },

  //{path: 'home', component: AppLayoutComponent, canActivateChild: [AuthGuardService]},
  //{path: 'home', component: AppLayoutComponent, canActivateChild: [AuthGuardChildFunction]},
  {path: 'home', component: AppLayout},
  {path: 'system', loadChildren: () => import('src/app/system/system-management-routing.module').then(m => m.routes), data: {breadcrumb: 'system'}},
  {path: 'hrm', loadChildren: () => import('src/app/hrm/hrm-routing.module').then(m => m.routes)},
  {path: 'grw', loadChildren: () => import('src/app/cooperation/cooperation-routing.module').then(m => m.routes)},
  {path: 'profile', loadChildren: () => import('src/app/app-layout/app-layout.module').then(m => m.routes)},
  //{path: 'post-write/:boardId', component: PostFormComponent},
  //{path: 'post-edit/:boardId/:formDataId', component: PostFormComponent},
  //{path: 'post-view', component: PostViewComponent},
  {path: 'post-write/:boardId', loadComponent: () => import('src/app/cooperation/web-board/post/post-form').then(m => m.PostForm)},
  {path: 'post-edit/:boardId/:formDataId', loadComponent: () => import('src/app/cooperation/web-board/post/post-form').then(m => m.PostForm)},
  {path: 'post-view', loadComponent: () => import('src/app/cooperation/web-board/post/post-view').then(m => m.PostView)},
  {path: 'test', loadChildren: () => import('./pages/welcome/welcome-routing.module').then(m => m.routes)},
];

import { Routes } from '@angular/router';

import { AppLayout } from '../app-layout/app-layout';

import { AuthGuardService } from '../core/service/auth-guard.service';

export const routes: Routes = [
  {
    path: '', component: AppLayout, //canActivateChild: [AuthGuardService],
    children: [
      {path: 'company',       loadComponent: () => import('./company/app-company').then(m => m.AppCompany)},
      {path: 'user',          loadComponent: () => import('./user/app-user').then(m => m.UserApp), data: {breadcrumb: 'user'}},
      {path: 'role',          loadComponent: () => import('./role/app-role').then(m => m.RoleApp)},
      {path: 'menu',          loadComponent: () => import('./menu/app-menu').then(m => m.MenuApp)},
      {path: 'menu-role',     loadComponent: () => import('./menu-role/app-menu-role').then(m => m.MenuRoleApp)},
      {path: 'webresource',   loadComponent: () => import('./webresource/app-web-resource').then(m => m.WebResourceApp)},
      {path: 'commoncode',    loadComponent: () => import('./hierarchy-code/app-hierarchy-code').then(m => m.AppHierarchyCode)},
      {path: 'dept',          loadComponent: () => import('./dept/app-dept').then(m => m.DeptApp)},
      {path: 'term',          loadComponent: () => import('./terms/app-term').then(m => m.TermApp)},
      {path: 'holiday',       loadComponent: () => import('./holiday/app-holiday').then(m => m.HolidayApp)},
      {path: 'bizcode',       loadComponent: () => import('./biz-code/app-biz-code').then(m => m.BizCodeApp)}
    ]
  }
];

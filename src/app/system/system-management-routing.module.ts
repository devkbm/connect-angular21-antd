import { Routes } from '@angular/router';

import { AppLayout } from '../app-layout/app-layout';

import { AuthGuardService } from '../core/service/auth-guard.service';

export const routes: Routes = [
  {
    path: '', component: AppLayout, //canActivateChild: [AuthGuardService],
    children: [
      {path: 'company',       loadComponent: () => import('./company/app-company')},
      {path: 'user',          loadComponent: () => import('./user/app-user'), data: {breadcrumb: 'user'}},
      {path: 'role',          loadComponent: () => import('./role/app-role')},
      {path: 'menu',          loadComponent: () => import('./menu/app-menu')},
      {path: 'menu-role',     loadComponent: () => import('./menu-role/app-menu-role')},
      {path: 'webresource',   loadComponent: () => import('./webresource/app-web-resource')},
      {path: 'commoncode',    loadComponent: () => import('./hierarchy-code/app-hierarchy-code')},
      {path: 'dept',          loadComponent: () => import('./dept/app-dept')},
      {path: 'term',          loadComponent: () => import('./terms/app-term')},
      {path: 'holiday',       loadComponent: () => import('./holiday/app-holiday')},
      {path: 'bizcode',       loadComponent: () => import('./biz-code/app-biz-code')}
    ]
  }
];


import { Routes } from '@angular/router';

import { AppLayout } from '../app-layout/app-layout';

import { AuthGuardService } from '../core/service/auth-guard.service';

export const routes: Routes = [
  {
    path: '', component: AppLayout/*, canActivateChild: [AuthGuardService]*/,
    children: [
      {path: 'team',          loadComponent: () => import('./team/app-team')},
      {path: 'board',         loadComponent: () => import('./web-board/app-board')},
      {path: 'boardm',        loadComponent: () => import('./web-board/app-board-management')},
      {path: 'todo',          loadComponent: () => import('./todo/app-todo')},
      {path: 'workcalendar',  loadComponent: () => import('./work-calendar/app-work-calendar')}
    ]
  }
];

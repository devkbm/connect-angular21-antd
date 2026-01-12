
import { Routes } from '@angular/router';

import { AppLayout } from '../app-layout/app-layout';

import { AuthGuardService } from '../core/service/auth-guard.service';

export const routes: Routes = [
  {
    path: '', component: AppLayout/*, canActivateChild: [AuthGuardService]*/,
    children: [
      {path: 'team',          loadComponent: () => import('./team/app-team').then(m => m.TeamApp)},
      {path: 'board',         loadComponent: () => import('./web-board/app-board').then(m => m.BoardApp)},
      {path: 'boardm',        loadComponent: () => import('./web-board/app-board-management').then(m => m.BoardManagementApp)},
      {path: 'todo',          loadComponent: () => import('./todo/app-todo').then(m => m.TodoApp)},
      {path: 'workcalendar',  loadComponent: () => import('./work-calendar/app-work-calendar').then(m => m.WorkCalendarApp)}
    ]
  }
];

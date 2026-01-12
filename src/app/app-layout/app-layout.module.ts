import { Routes } from '@angular/router';

import { AppLayout } from './app-layout';

export const routes: Routes = [
  {
    path: '', component: AppLayout/*, canActivateChild: [AuthGuardService]*/,
    children: [
      {path: 'edit',             loadComponent: () => import('./user-profile/user-profile-form').then(m => m.UserProfileForm)}
    ]
  }
];

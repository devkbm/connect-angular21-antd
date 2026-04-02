import { Routes } from '@angular/router';

import { AppLayout } from '../app-layout/app-layout';
import { AuthGuardChildFunction, AuthGuardService } from '../core/service/auth-guard.service';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';
import { EnvironmentProviders, importProvidersFrom } from '@angular/core';

export const provideFormlyConfig = (config: ConfigOption): EnvironmentProviders => importProvidersFrom([
  FormlyModule.forChild(config),
]);

export const routes: Routes = [
  {
    path: '', component: AppLayout/*, canActivateChild: [AuthGuardService]*/,
    children: [
      {path: 'hrmtype',           loadComponent: () => import('./hrm-code/app-hrm-code')/*.then(m => m.HrmCodeApp)*/, providers: [provideFormlyConfig({})]},
      {path: 'dutyapplication',   loadComponent: () => import('./attendance-application/app-attendance-application')},
      {path: 'staff',             loadComponent: () => import('./staff/app-staff-management')},
      {path: 'partnerstaff',      loadComponent: () => import('./partner-staff/app-partner-staff')},
      {path: 'appointmentlist',   loadComponent: () => import('./appointment-list/appointment-list-grid').then(m => m.AppointmentListGrid)},
      {path: 'payitem',           loadComponent: () => import('./pay-item/app-pay-item')},
      {path: 'paytable',          loadComponent: () => import('./pay-table/app-pay-table')},
      {path: 'payitemstaff',      loadComponent: () => import('./pay-item-staff/app-pay-item-staff')},
      {path: 'payexpression',     loadComponent: () => import('./pay-expression/app-pay-expression')}
    ]
  }
];

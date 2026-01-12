import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { FormTestComponent } from './form-test.component';

export const routes: Routes = [
  { path: '1', component: WelcomeComponent },
  { path: 'form', component: FormTestComponent },
];

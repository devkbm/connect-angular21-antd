import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { SessionManager, UserToken } from '../core/session-manager';
import { GlobalProperty } from '../core/global-property';
import { getHttpOptions } from '../core/http/http-utils';

@Component({
  selector: 'app-oauth2-login-success',
  imports: [
    CommonModule,
  ],
  template: `
  `,
  styles: `
    :host {
      display: block;
    }
  `
})
export class Oauth2LoginSuccess implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  private FIRST_PAGE_URL = '/home';

  token = "";

  ngOnInit(): void {
    this.token = this.route.snapshot.params['id'];

    if (this.token != null) {
      sessionStorage.setItem('token', this.token);

      this.validAuth('001');
    }

  }

  validAuth(companyCode: string) {
      const url = GlobalProperty.serverUrl() + '/api/system/user/oauth2?companyCode='+companyCode;
      const options = getHttpOptions();

      this.http.get<UserToken>(url, options).pipe(
          //  catchError(this.handleError<UserToken>('getAuthToken', undefined))
          )
          .subscribe(
            (model: UserToken) => {
              SessionManager.saveSessionStorage(model);

              this.router.navigate([this.FIRST_PAGE_URL, {isForwarding: true}]);
            }
          );
    }

}

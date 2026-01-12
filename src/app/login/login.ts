import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { SessionManager, UserToken } from 'src/app/core/session-manager';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { WindowRef } from 'src/app/core/window-ref';
import { GlobalProperty } from 'src/app/core/global-property';

import { NzRadioModule } from 'ng-zorro-antd/radio';


@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzRadioModule
  ],
  template: `
<div class="body">
  <div class="login">
    <h1>Login</h1>

    <nz-radio-group [(ngModel)]="serverType" nzButtonStyle="solid">
      <label nz-radio-button nzValue="LOCAL">로컬</label>
      <label nz-radio-button nzValue="PROD">운영기</label>
    </nz-radio-group>{{serverType()}}

    <form nz-form [formGroup]="form">
      <input type="text" formControlName="staffNo" placeholder="Username" required="required" />
      <input type="password" formControlName="password" placeholder="Password" required="required" />
      <button type="submit" class="btn btn-primary btn-block btn-large" (click)="submitForm()">로그인</button>
      <!--<button type="submit" class="btn btn-primary btn-block btn-large" (click)="socialLoginGoogle()">구글 로그인</button>-->
      <button type="submit" class="btn">
        <img src="assets/icons/login_btn_kakao.png" class="btn-img" (click)="socialLoginKakao()">
      </button>
      <button type="submit" class="btn">
        <img src="assets/icons/login_btn_naver.png" class="btn-img" (click)="socialLoginNaver()">
      </button>
      <button type="submit" class="btn">
        <img src="assets/icons/login_btn_google.png" class="btn-img" (click)="socialLoginGoogle()">
      </button>
    </form>

  </div>
</div>
  `,
  styles: `

//.btn { display: inline-block; *display: inline; *zoom: 1; padding: 4px 10px 4px; margin-bottom: 0; font-size: 13px; line-height: 18px; color: #333333; text-align: center;text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75); vertical-align: middle; background-color: #f5f5f5; background-image: -moz-linear-gradient(top, #ffffff, #e6e6e6); background-image: -ms-linear-gradient(top, #ffffff, #e6e6e6); background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#ffffff), to(#e6e6e6)); background-image: -webkit-linear-gradient(top, #ffffff, #e6e6e6); background-image: -o-linear-gradient(top, #ffffff, #e6e6e6); background-image: linear-gradient(top, #ffffff, #e6e6e6); background-repeat: repeat-x; filter: progid:dximagetransform.microsoft.gradient(startColorstr=#ffffff, endColorstr=#e6e6e6, GradientType=0); border-color: #e6e6e6 #e6e6e6 #e6e6e6; border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25); border: 1px solid #e6e6e6; -webkit-border-radius: 4px; -moz-border-radius: 4px; border-radius: 4px; -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05); -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05); cursor: pointer; *margin-left: .3em; }

/* Style buttons */
.btn {
  cursor: pointer; /* Mouse pointer on hover */
  border: none; /* Remove borders */
  width: 48px;
  height: 48px;
  padding: 0 0 0 0;
  margin: 5px 5px 0 0;
  border-radius: 6px;
}

.btn-img {
  width: 48px;
  height: 48px;
}

.btn:hover, .btn:active, .btn.active, .btn.disabled, .btn[disabled] { background-color: #e6e6e6; }
.btn-large { padding: 9px 14px; font-size: 15px; line-height: normal; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; }
.btn:hover { color: #333333; text-decoration: none; background-color: #e6e6e6; background-position: 0 -15px; -webkit-transition: background-position 0.1s linear; -moz-transition: background-position 0.1s linear; -ms-transition: background-position 0.1s linear; -o-transition: background-position 0.1s linear; transition: background-position 0.1s linear; }
.btn-primary, .btn-primary:hover { text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25); color: #ffffff; }
.btn-primary.active { color: rgba(255, 255, 255, 0.75); }
.btn-primary { background-color: #4a77d4; background-image: -moz-linear-gradient(top, #6eb6de, #4a77d4); background-image: -ms-linear-gradient(top, #6eb6de, #4a77d4); background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#6eb6de), to(#4a77d4)); background-image: -webkit-linear-gradient(top, #6eb6de, #4a77d4); background-image: -o-linear-gradient(top, #6eb6de, #4a77d4); background-image: linear-gradient(top, #6eb6de, #4a77d4); background-repeat: repeat-x; filter: progid:dximagetransform.microsoft.gradient(startColorstr=#6eb6de, endColorstr=#4a77d4, GradientType=0);  border: 1px solid #3762bc; text-shadow: 1px 1px 1px rgba(0,0,0,0.4); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.5); }
.btn-primary:hover, .btn-primary:active, .btn-primary.active, .btn-primary.disabled, .btn-primary[disabled] { filter: none; background-color: #4a77d4; }
.btn-block { width: 100%; display:block; }

* { -webkit-box-sizing:border-box; -moz-box-sizing:border-box; -ms-box-sizing:border-box; -o-box-sizing:border-box; box-sizing:border-box; }

html { width: 100%; height:100%; overflow:hidden; }

.body {
  width: 100%;
  height:100%;
  //font-family: 'Open Sans', sans-serif;
  background: -moz-radial-gradient(0% 100%, ellipse cover, rgba(104,128,138,.4) 10%,rgba(138,114,76,0) 40%),-moz-linear-gradient(top,  rgba(57,173,219,.25) 0%, rgba(42,60,87,.4) 100%), -moz-linear-gradient(-45deg,  #670d10 0%, #092756 100%);
  background: -o-radial-gradient( 0% 100%, ellipse cover, rgba(104,128,138,.4) 10%,rgba(138,114,76,0) 40%), -o-linear-gradient(top,  rgba(57,173,219,.25) 0%,rgba(42,60,87,.4) 100%), -o-linear-gradient(-45deg,  #670d10 0%,#092756 100%);
  background: -ms-radial-gradient( 0% 100%, ellipse cover, rgba(115, 132, 139, 0.4) 10%,rgba(138,114,76,0) 40%), -ms-linear-gradient(top,  rgba(57,173,219,.25) 0%,rgba(42,60,87,.4) 100%), -ms-linear-gradient(-45deg,  #670d10 0%,#092756 100%);
  background: -webkit-radial-gradient(0% 100%, ellipse cover, rgba(104,128,138,.4) 10%,rgba(138,114,76,0) 40%), linear-gradient(to bottom,  rgba(57,173,219,.25) 0%,rgba(42,60,87,.4) 100%), linear-gradient(135deg,  #670d10 0%,#092756 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#3E1D6D', endColorstr='#092756',GradientType=1 );
}

.login {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -150px 0 0 -150px;
  width:300px;
  height:300px;
}
.login h1 { color: #fff; text-shadow: 0 0 10px rgba(0,0,0,0.3); letter-spacing:1px; text-align:center; }

input {
  width: 100%;
  margin-bottom: 10px;
  background: rgba(0,0,0,0.3);
  border: none;
  outline: none;
  padding: 10px;
  font-size: 13px;
  color: #fff;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.3);
  border: 1px solid rgba(0,0,0,0.3);
  border-radius: 4px;
  box-shadow: inset 0 -5px 45px rgba(100,100,100,0.2), 0 1px 1px rgba(255,255,255,0.2);
  -webkit-transition: box-shadow .5s ease;
  -moz-transition: box-shadow .5s ease;
  -o-transition: box-shadow .5s ease;
  -ms-transition: box-shadow .5s ease;
  transition: box-shadow .5s ease;
}
input:focus { box-shadow: inset 0 -5px 45px rgba(100,100,100,0.4), 0 1px 1px rgba(255,255,255,0.2); }


  `
})
export class Login implements OnInit {

  private http = inject(HttpClient);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private winRef = inject(WindowRef);

  form = inject(FormBuilder).group({
    companyCode       : new FormControl<string | null>('001', { validators: Validators.required }),
    staffNo           : new FormControl<string | null>(null, { validators: Validators.required }),
    password          : new FormControl<string | null>(null, { validators: Validators.required }),
    remember          : new FormControl<boolean>(false, { validators: Validators.required })
  });

  private FIRST_PAGE_URL = '/home';

  serverType = signal<'LOCAL' | 'PROD'>('PROD');

  constructor() {
    effect(() => {
      if (this.serverType()) {
        if (this.serverType() === 'LOCAL') {
          GlobalProperty._serverUrl = 'https://localhost:8090'
          sessionStorage.setItem('serverUrl', 'https://localhost:8090');
        } else if (this.serverType() === 'PROD') {
          sessionStorage.setItem('serverUrl', 'https://connect-one.kro.kr');
        }
      }
    })
  }

  ngOnInit(): void {
    const token = this.route.snapshot.params['id'];

    if (token != null) {
      sessionStorage.setItem('token', token);

      this.validAuth('001');
    }
  }

  submitForm(): void {

    const url =  GlobalProperty.serverUrl() + `/api/system/user/login`;
    const body = {companyCode: '001', staffNo: this.form.value.staffNo!, password: this.form.value.password!};
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      withCredentials: true
    }

    this.http
        .post<UserToken>(url, body, options).pipe(
          // tap((userToken: UserToken) => console.log(userToken.token) ),
          // catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: UserToken) => {
            this.setItemSessionStorage(model);

            this.router.navigate([this.FIRST_PAGE_URL, {isForwarding: true}]);
          }
        );
  }

  validAuth(companyCode: string) {
    const url =  GlobalProperty.serverUrl() + '/api/system/user/auth?companyCode='+companyCode;
    const options = getHttpOptions();

    this.http.get<UserToken>(url, options).pipe(
        //  catchError(this.handleError<UserToken>('getAuthToken', undefined))
        )
        .subscribe(
          (model: UserToken) => {
            this.setItemSessionStorage(model);

            this.router.navigate([this.FIRST_PAGE_URL]);
          }
        );
  }

  private setItemSessionStorage(data: UserToken) {
    SessionManager.saveSessionStorage(data);
  }

  socialLoginGoogle(): void {
    window.location.href = GlobalProperty.serverUrl() + '/oauth2/authorization/google?companyCode=001';
  }

  socialLoginKakao(): void {
    window.location.href = GlobalProperty.serverUrl() + '/oauth2/authorization/kakao?companyCode=001';
  }

  socialLoginNaver(): void {
    window.location.href = GlobalProperty.serverUrl() + '/oauth2/authorization/naver?companyCode=001';
  }


  test() {
    //window.open('/home','_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,status=no,top=500,left=500,width=400,height=400');
    const popOption = 'scrollbars=yes, menubar=no, resizable=no, top=500, left=500, width=400, height=400';
    var windowObjectReference = this.winRef.nativeWindow.open('/home/board', "", popOption);
    windowObjectReference.focus();

    console.log(windowObjectReference);
  }
}

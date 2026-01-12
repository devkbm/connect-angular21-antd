
import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";
import { LoginService } from "src/app/login/login.service";
import { UserToken } from "../session-manager";

@Injectable()
export class AuthGuardService implements CanActivate,CanActivateChild {

  constructor(private loginService: LoginService,
              private router: Router) { }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return new Observable<boolean>(e => {
      this.loginService.getAuthToken('001')
                       .subscribe((model: UserToken) => {
                        if (this.isAuthenticated(model.sessionId)) {
                          e.next(true);
                        } else {
                          e.next(false);
                          this.router.navigate(['/login']);
                        }
                      });
      });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
      return new Observable<boolean>(e => {
        this.loginService.getAuthToken('001')
                         .subscribe((model: UserToken) => {
                          if (this.isAuthenticated(model.sessionId)) {
                            e.next(true);
                          } else {
                            e.next(false);
                            this.router.navigate(['/login']);
                          }
                        });
          });
  }

  private isAuthenticated(token: string): boolean {
    const session_token = sessionStorage.getItem('token') as string;
    return session_token === token ? true : false;
  }

}


export const AuthGuardFunction: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => new Observable<boolean>(e => {
    const loginService: LoginService = inject(LoginService);
    const router: Router = inject(Router);

    return loginService.getAuthToken('001')
                .subscribe((model: UserToken) => {
                  const session_token = sessionStorage.getItem('token') as string;

                  if (session_token === model.sessionId) {
                    e.next(true);
                  } else {
                    router.createUrlTree(['/login']);
                    e.next(false);
                  }
                });
});

export const AuthGuardChildFunction: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => new Observable<boolean>(e => {
    const loginService: LoginService = inject(LoginService);
    const router: Router = inject(Router);

    return loginService.getAuthToken('001')
                .subscribe((model: UserToken) => {
                  const session_token = sessionStorage.getItem('token') as string;
                  console.log('session_token:'+ session_token);
                  console.log('model.sessionId:'+ model.sessionId);
                  if (session_token === model.sessionId) {
                    e.next(true);
                  } else {
                    router.createUrlTree(['/login']);
                    e.next(false);
                  }
                });
});



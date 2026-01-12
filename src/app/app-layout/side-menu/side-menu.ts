import { Component, inject, input, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { NzMenuModeType, NzMenuModule, NzMenuThemeType } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';

import { MenuHierarchy } from '../app-layout.model';

import { SessionManager } from 'src/app/core/session-manager';
import { ResponseList } from 'src/app/core/model/response-list';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { filter } from 'rxjs';

@Component({
  selector: 'app-side-menu',
  imports: [
    CommonModule,
    RouterModule,
    NzMenuModule,
    NzIconModule,
    NzImageModule
  ],
  template: `
      <div class="logo">LOGO</div>

      <ul class="menu" nz-menu [nzTheme]="menuInfo().theme" [nzMode]="menuInfo().mode" [nzInlineIndent]="menuInfo().inline_indent">
        <ng-container *ngTemplateOutlet="menuTpl; context: { $implicit: menuInfo().menuItems }"></ng-container>
        <ng-template #menuTpl let-menus>
          @for (menu of menus; track menu.key) {
            @if (!menu.children) {
              <li
                nz-menu-item
                [nzPaddingLeft]="menu.level * 24"
                [nzDisabled]="menu.disabled"
                routerLinkActive="active" [routerLink]="menu.url"
                (click)="saveSessionUrl($event)"
              >

            <!--(click)="moveToUrl(menu.url)" -->
                <!-- [nzSelected]="menu.selected" -->
                <!--<a routerLinkActive="active" [routerLink]="menu.url"></a>-->

                @if (menu.appIconType === 'RESOURCE' && menu.icon) {
                  <img
                    nz-image
                    width="20px"
                    height="20px"
                    [nzSrc]="menu.icon"
                  />&nbsp;
                }
                @else if (menu.icon) {
                  <span nz-icon [nzType]="menu.icon"></span>
                }
                <span>{{ menu.title }}</span>
              </li>
            } @else {
              <li
                nz-submenu
                [nzPaddingLeft]="menu.level * 24"
                [nzOpen]="menu.open"
                [nzTitle]="menu.title"
                [nzIcon]="menu.icon"
                [nzDisabled]="menu.disabled"
              >
              <ul>
                <ng-container *ngTemplateOutlet="menuTpl; context: { $implicit: menu.children }"></ng-container>
              </ul>
            </li>
            }
          }
        </ng-template>
      </ul>
  `,
  styles: [`
    .logo {
      display: flex;
      /*위에서 아래로 수직 배치*/
      flex-direction: column;
      /*중앙정렬*/
      justify-content: center;
      text-align: center;
      width: 200px;
      height: 64px;

      background-color: darkslategray;
      color: white;
      font-weight: 300;
      font-size: 30px;
      line-height: 0.6;
      font-family: 'Bangers', cursive;
      letter-spacing: 5px;
      text-shadow: 5px 2px #222324, 2px 4px #222324, 3px 5px #222324;
    }

    .menu {
      height: 100%;
      width: 200px;
    }
  `]
})
export class SideMenu {

  private router = inject(Router);
  private http = inject(HttpClient);

  menuInfo = signal<{theme: NzMenuThemeType, mode: NzMenuModeType, inline_indent: number, isCollapsed: boolean, menuItems: MenuHierarchy[]}>({
    theme: 'dark',
    mode: 'inline',
    inline_indent: 12,
    isCollapsed: false,
    menuItems: []
  });

  menuGroupCode = input<string>('');

  previousUrl: string = '';
  currentUrl: string = '';

  constructor() {
    effect(() => {
      if (this.menuGroupCode() !== '') {
        this.getMenuList(this.menuGroupCode());
      }
    })
  }

  saveSessionUrl(ev: any) {
    sessionStorage.setItem('lastVisitUrl', this.router.currentNavigation()?.initialUrl.toString()!);
  }

  getMenuList(menuGroupCode: string): void {

    const userId = SessionManager.getUserId() as string;
    const url =  GlobalProperty.serverUrl() + `/api/system/menuhierarchy/${userId}/${menuGroupCode}`;
    const options = getHttpOptions();

    this.http.get<ResponseList<MenuHierarchy>>(url, options).pipe(
          // catchError(this.handleError<ResponseObject<BizCode>>('get', undefined))
        )
        .subscribe(
          (model: ResponseList<MenuHierarchy>) => {
            this.menuInfo.update(obj => ({...obj, menuItems: model.data}));

            sessionStorage.setItem('menuList', JSON.stringify(model.data));
          }
        );
  }

}

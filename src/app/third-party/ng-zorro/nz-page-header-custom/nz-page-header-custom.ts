import { Component, TemplateRef, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MenuBreadCrumb, SessionManager } from 'src/app/core/session-manager';

import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'nz-page-header-custom',
  imports: [
    RouterModule,
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzIconModule
  ],
  template: `
    <!--
    <nz-breadcrumb [nzAutoGenerate]="true" nzSeparator=">">
      <nz-breadcrumb-item><a routerLink="/home"><span nz-icon [nzType]="'home'"></span></a></nz-breadcrumb-item>
    </nz-breadcrumb>
    -->
    <nz-page-header (nzBack)="goBack()" nzBackIcon [nzTitle]="title()" [nzSubtitle]="subtitle()">
      <nz-breadcrumb nz-page-header-breadcrumb nzSeparator=">" >
        <nz-breadcrumb-item><a routerLink="/home"><span nz-icon [nzType]="'home'"></span></a></nz-breadcrumb-item>
        @for (menu of menuBreadCrumb; track menu.url) {
          <nz-breadcrumb-item>{{menu.name}}</nz-breadcrumb-item>
        }
      </nz-breadcrumb>
    </nz-page-header>

  `,
  styles: [`
  `]
})
export class NzPageHeaderCustom {

  //menuBreadCrumb: MenuBreadCrumb[] = SessionManager.createBreadCrumb();
  menuBreadCrumb: MenuBreadCrumb[] = this.createBreadCrumb();

  title = input<string | TemplateRef<void>>('');
  subtitle = input<string | TemplateRef<void>>('');

  protected _location = inject(Location);

  goBack() {
    this._location.back();
  }

  goFoward() {
    this._location.forward();
  }

  createBreadCrumb(): MenuBreadCrumb[] {
    const menuGroupList       = JSON.parse(sessionStorage.getItem('menuGroupList') as string);
    const sessionMenuGroup    = sessionStorage.getItem('selectedMenuGroup') as string;
    let menuGroupUrl = '';
    for (const menuGroup of menuGroupList) {
      if (menuGroup.menuGroupCode === sessionMenuGroup) {
        menuGroupUrl = menuGroup.menuGroupUrl;
      }
    }

    const obj = JSON.parse(sessionStorage.getItem('menuList') as string);
    let names: MenuBreadCrumb[] = new Array();
    // 현재 화면에 해당하는 메뉴 탐색
    let find = (children: any[]): boolean => {
      for (const child of children) {
        names.push({name: child.title, isLink: child.menuType === 'ITEM' ? true : false, url: child.url, marked: false});
        if (child.leaf) {
          if (window.location.pathname === '/' + menuGroupUrl + '/' + child.url) {
            names[names.length-1].marked = true;
            return true;
          } else {
            names.pop();  // Leaf 노드중 일치하지 않은 메뉴 제거
          }
        } else if (child.children) {
          find(child.children);
          if (names[names.length-1].marked !== true) { // Leaf 노드 중 marked 되지 않은 노드 제거
            names.pop();
          }
        }
      }
      return false;
    }
    find(obj);

    //console.log(names);
    return names;
  }

}

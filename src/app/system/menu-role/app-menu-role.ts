import { Component, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ResponseList } from 'src/app/core/model/response-list';

import { MenuGroupGrid } from '../menu/menu-group-grid';
import { RoleGrid } from '../role/role-grid';
import { RoleForm } from '../role/role-form';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MenuGrid } from '../menu/menu-grid.';
import { MenuForm } from '../menu/menu-form';
import { MenuGroupForm } from '../menu/menu-group-form';
import { MenuRoleTree } from './menu-role-tree';

import { NzFormModule } from 'ng-zorro-antd/form';

import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { NzSelectModule } from 'ng-zorro-antd/select';


export interface Role {
  roleCode: string | null;
  roleName: string | null;
  description: string | null;
  menuGroupCode: string | null;
}

export interface MenuGroup {
  menuGroupCode: string | null;
  menuGroupName: string | null;
  menuGroupUrl: string | null;
  description: string | null;
  sequence: number | null;
}

@Component({
  selector: 'menu-role-app',
  imports: [
    CommonModule,
    FormsModule,
    NzFormModule,
    NzButtonModule,
    NzSelectModule,
    NzDrawerModule,

    MenuGroupGrid,
    MenuGroupForm,
    MenuGrid,
    MenuForm,
    RoleGrid,
    RoleForm,
    MenuRoleTree
  ],
  template: `
    <button nz-button (click)="newRole()">신규 롤</button>
    <button nz-button (click)="newMenuGroup()">신규 메뉴그룹</button>
    <button nz-button (click)="newMenu()">신규 메뉴</button>
    <div nz-col nzSpan="12">
      <nz-form-item>
        <nz-form-label nzFor="menuGroup" nzRequired>메뉴그룹</nz-form-label>
        <nz-form-control>
          <nz-select nzId="roleList" [(ngModel)]="menuGroup.selectedItem">
            @for (option of menuGroup.list; track option) {
              <nz-option
                [nzLabel]="option.menuGroupName"
                [nzValue]="option.menuGroupCode">
              </nz-option>
            }
          </nz-select>
        </nz-form-control>
      </nz-form-item>
    </div>

    <div nz-col nzSpan="12">
      <nz-form-item>
        <nz-form-label nzFor="roleCode" nzRequired>롤</nz-form-label>
        <nz-form-control>
          <nz-select nzId="roleCode" [(ngModel)]="role.selectedItem">
            @for (option of menuGroup.list; track option) {
              <nz-option
                [nzLabel]="option.description"
                [nzValue]="option.roleCode">
              </nz-option>
            }
          </nz-select>
        </nz-form-control>
      </nz-form-item>
    </div>

    <div class="page-content">
      @defer {
      <menu-group-grid class="grid1"
        (rowClicked)="menuGroupClicked($event)"
        (editButtonClicked)="editMenuGroup($event)"
        (rowDoubleClicked)="editMenuGroup($event)">
      </menu-group-grid>
      }
      @defer {
      <menu-grid class="grid2"
        (rowClicked)="menuClicked($event)"
        (editButtonClicked)="editMenu($event)"
        (rowDoubleClicked)="editMenu($event)">
      </menu-grid>
      }
      <role-grid class="grid3"
        (rowClicked)="roleClicked($event)"
        (editButtonClicked)="editRole($event)"
        (rowDoubleClicked)="editRole($event)">
      </role-grid>

      <app-menu-role-tree class="tree"
        [menuGroupCode]="menuGroup.selectedItem"
        [roleCode]="role.selectedItem">
      </app-menu-role-tree>
    </div>


    <nz-drawer
      [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px'}"
      [nzMaskClosable]="true"
      [nzWidth]="720"
      [nzVisible]="drawer.role.visible"
      nzTitle="롤 등록"
      (nzOnClose)="closeDrawer('role')">
        <role-form #form *nzDrawerContent
          [formDataId]="drawer.role.formDataId"
          (formSaved)="getRoleList()"
          (formDeleted)="getRoleList()"
          (formClosed)="closeDrawer('role')">
        </role-form>
    </nz-drawer>

    <nz-drawer
      [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
      [nzMaskClosable]="true"
      nzWidth="80%"
      [nzVisible]="drawer.menuGroup.visible"
      nzTitle="메뉴그룹 등록"
      (nzOnClose)="drawer.menuGroup.visible = false">
        <menu-group-form #menuGroupForm *nzDrawerContent
          [formDataId]="drawer.menuGroup.formDataId"
          (formSaved)="getMenuGroupList()"
          (formDeleted)="getMenuGroupList()"
          (formClosed)="drawer.menuGroup.visible = false">
        </menu-group-form>
    </nz-drawer>

    <nz-drawer
      [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
      [nzMaskClosable]="true"
      nzWidth="80%"
      [nzVisible]="drawer.menu.visible"
      nzTitle="메뉴 등록"
      (nzOnClose)="drawer.menu.visible = false">
        <menu-form #menuForm *nzDrawerContent
          [formDataId]="drawer.menu.formDataId"
          (formSaved)="getMenuList()"
          (formDeleted)="getMenuList()"
          (formClosed)="drawer.menu.visible = false">
        </menu-form>
    </nz-drawer>
  `,
  styles: `
  :host {
    --page-header-height: 98px;
    --page-search-height: 46px;
    --page-content-title-height: 26px;
    --page-content-title-margin-height: 6px;
    --page-content-margin-height: 6px;
  }

  .page-header {
    height: var(--page-header-height);
  }

  .page-search {
    height: var(--page-search-height);
  }

  .page-content-title {
    height: var(--page-content-title-height);
  }

  .page-content {
    margin-top: var(--page-content-margin-height);
    height: calc(100vh - (
                          var(--app-header-height) +
                          var(--app-footer-height) +
                          var(--page-header-height) +
                          var(--page-search-height) +
                          var(--page-content-margin-height)
                        )
                );
    /*height: 900px;*/
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 0.6fr 0.4fr;
    column-gap: 12px;
    row-gap: 12px;
    grid-template-areas:
      "grid1  grid3 tree"
      "grid2  grid3  tree";
  }

  .grid1 {
    grid-area: grid1;
  }

  .grid2 {
    grid-area: grid2;
  }

  .grid3 {
    grid-area: grid3;
  }

  .tree {
    grid-area: tree;
  }

  `
})
export class MenuRoleApp {

  menuGroup: {list: any, selectedItem: string} = {list: [], selectedItem: ''};
  role: {list: any, selectedItem: string} = {list: [], selectedItem: ''};

  private http = inject(HttpClient);

  roleGrid = viewChild.required(RoleGrid);
  menuGroupGrid = viewChild.required(MenuGroupGrid);
  menuGrid = viewChild.required(MenuGrid);

  drawer: {
    menuGroup: { visible: boolean, formDataId: any },
    menu: { visible: boolean, formDataId: any },
    role: { visible: boolean, formDataId: any }
  } = {
    menuGroup: { visible: false, formDataId: null },
    menu: { visible: false, formDataId: null },
    role: { visible: false, formDataId: null }
  }

  constructor() {
    this.getMenuGroupList();
    this.getRoleList();
  }

  getMenuGroupList(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/menugroup`;
    const options = getHttpOptions();

    this.http
        .get<ResponseList<MenuGroup>>(url, options).pipe(
                //catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseList<MenuGroup>) => {
            if (model.data) {
              this.menuGroup.list = model.data;
            }
          }
        )
  }

  getRoleList(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/role`;
    const options = getHttpOptions();

    this.http
        .get<ResponseList<Role>>(url, options).pipe(
          // catchError(this.handleError<ResponseList<Role>>('getAuthorityList', undefined))
        )
        .subscribe(
          (model: ResponseList<Role>) => {
            if (model.data) {
              this.role.list = model.data;
            }
          }
        )
  }

  openDrawer(type: 'role' | 'menuGroup' | 'menu') {
    switch (type) {
      case 'role':
        this.drawer.role.visible = true;
        break;
      case 'menuGroup':
        this.drawer.menuGroup.visible = true;
        break;
      case 'menu':
        this.drawer.menu.visible = true;
        break;
    }
  }

  closeDrawer(type: 'role' | 'menuGroup' | 'menu') {
    switch (type) {
      case 'role':
        this.drawer.role.visible = false;
        break;
      case 'menuGroup':
        this.drawer.menuGroup.visible = false;
        break;
      case 'menu':
        this.drawer.menu.visible = false;
        break;
    }
  }

  //#region MenuGroup
  menuGroupClicked(args: any) {
    this.menuGroup.selectedItem = args.menuGroupCode;
    this.drawer.menuGroup.formDataId = args.menuGroupCode;
    this.role.selectedItem = '';
    this.roleGrid().gridQuery.set({menuGroupCode: this.menuGroup.selectedItem});

    this.getMenuList();
  }

  newMenuGroup() {
    this.drawer.menuGroup.formDataId = null;
    this.openDrawer('menuGroup');
  }

  editMenuGroup(args: any) {
    this.openDrawer('menuGroup');
  }
  //#endregion

  //#region Menu
  getMenuList() {
    this.menuGrid().gridQuery.set({menuGroupCode: this.menuGroup.selectedItem});
  }

  menuClicked(args: any) {
    this.drawer.menu.formDataId = {menuGroupCode: args.menuGroupCode, menuCode: args.menuCode};
  }

  newMenu() {
    this.drawer.role.formDataId = null;
    this.openDrawer('menu');
  }

  editMenu(args: any) {
    this.drawer.menu.formDataId = {menuGroupCode: args.menuGroupCode, menuCode: args.menuCode};
    this.openDrawer('menu');
  }
  //#endregion

  //#region Role
  roleClicked(args: any) {
    this.role.selectedItem = args.roleCode;
    this.drawer.role.formDataId = args.roleCode;
  }

  newRole() {
    this.drawer.role.formDataId = null;
    this.openDrawer('role');
  }

  editRole(args: any) {
    this.openDrawer('role');
  }
  //#endregion

}

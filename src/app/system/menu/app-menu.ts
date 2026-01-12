import { Component, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MenuGroupGrid } from './menu-group-grid';
import { MenuGrid } from './menu-grid.';
import { MenuFormDrawer } from './menu-form-drawer';
import { MenuGroupFormDrawer } from './menu-group-form-drawer';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPageHeaderCustom } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom';
import { NgPage } from "src/app/core/app/nz-page";
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { MenuSearch } from "./menu-search";

@Component({
  selector: 'menu-app',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzDividerModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzPageHeaderCustom,
    MenuGroupGrid,
    MenuGrid,
    MenuGroupFormDrawer,
    MenuFormDrawer,
    NgPage,
    MenuSearch
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="메뉴 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <menu-search
    (search)="getMenuGroupList()"
    (newFormMenu)="newMenu()"
    (newFormMenuGroup)="newMenuGroup()"
  >
  </menu-search>
</ng-template>

<ng-page [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="page-content">
    <h3 class="header1">메뉴 그룹 목록</h3>
    @defer {
    <menu-group-grid class="grid1"
      (rowClicked)="menuGroupGridRowClicked($event)"
      (editButtonClicked)="editMenuGroup($event)"
      (rowDoubleClicked)="editMenuGroup($event)">
    </menu-group-grid>
    }
    <h3 class="header2">메뉴 목록</h3>
    @defer {
    <menu-grid class="grid2"
      (rowClicked)="menuGridRowClicked($event)"
      (editButtonClicked)="editMenu($event)"
      (rowDoubleClicked)="editMenu($event)">
    </menu-grid>
    }
  </div>
</ng-page>

<menu-group-form-drawer
  [drawer]="drawer.menuGroup"
  (drawerClosed)="getMenuGroupList()">
</menu-group-form-drawer>

<menu-form-drawer
  [drawer]="drawer.menu"
  (drawerClosed)="getMenuList()">
</menu-form-drawer>
  `,
  styles: `
:host {
  --page-header-height: 98px;
  --page-search-height: 46px;

}

.grid-title {
  margin-left: 6px;
  border-left: 6px solid green;
  padding-left: 6px;
  vertical-align: text-top;
}

.page-content {
  height: 100%;
  display: grid;
  grid-template-rows: 34px 1fr;
  grid-template-columns: 1fr 1.5fr;
  column-gap: 12px;
  grid-template-areas:
    "header1 header2"
    "grid1   grid2";
}

.text-align-right {
  text-align: right;
}

.header1 {
  grid-area: header1;
  margin-left: 6px;
  border-left: 6px solid green;
  padding-left: 6px;
  vertical-align: text-top;
}

.header2 {
  grid-area: header2;
  margin-left: 6px;
  border-left: 6px solid green;
  padding-left: 6px;
  vertical-align: text-top;
}

.grid1 {
  grid-area: grid1;
}

.grid2 {
  grid-area: grid2;
}

.footer {
  position: absolute;
  bottom: 0px;
  width: 100%;
  border-top: 1px solid rgb(232, 232, 232);
  padding: 10px 16px;
  text-align: right;
  left: 0px;
  /*background: #fff;*/
}
  `
})
export class MenuApp {

  gridMenuGroup = viewChild.required(MenuGroupGrid);
  gridMenu = viewChild.required(MenuGrid);
  search = viewChild.required(MenuSearch);

  drawer: {
    menuGroup: { visible: boolean, formDataId: any },
    menu: { visible: boolean, formDataId: any }
  } = {
    menuGroup: { visible: false, formDataId: null },
    menu: { visible: false, formDataId: null }
  }

  //#region 메뉴그룹
  getMenuGroupList(): void {
    let params: any = new Object();
    if ( this.search().query.menuGroup.value !== '') {
      params[this.search().query.menuGroup.key] = this.search().query.menuGroup.value;
    }

    this.drawer.menuGroup.visible = false;
    //this.gridMenu().clearData();
    this.gridMenuGroup().gridQuery.set(params);
  }

  newMenuGroup(): void {
    this.drawer.menuGroup.formDataId = null;
    this.drawer.menuGroup.visible = true;
  }

  editMenuGroup(item: any) {
    this.drawer.menuGroup.formDataId = item.menuGroupCode;
    this.drawer.menuGroup.visible = true;
  }

  menuGroupGridRowClicked(row: any): void {
    this.drawer.menuGroup.formDataId = row.menuGroupCode;
    this.drawer.menu.formDataId = {menuGroupCode: row.menuGroupCode};
    this.getMenuList();
  }
  //#endregion 메뉴그룹

  //#region 메뉴
  getMenuList(): void {
    let params: any = new Object();
    params['menuGroupCode'] = this.drawer.menuGroup.formDataId;

    if ( this.search().query.menu.value !== '') {
      params[this.search().query.menu.key] = this.search().query.menu.value;
    }

    this.drawer.menu.visible = false;
    this.gridMenu().gridQuery.set(params);
  }

  newMenu(): void {
    this.drawer.menu.visible = true;
  }

  editMenu(item: any) {
    this.drawer.menu.formDataId = {menuGroupCode: item.menuGroupCode, menuCode: item.menuCode};
    this.drawer.menu.visible = true;
  }

  menuGridRowClicked(row: any): void {
    this.drawer.menu.formDataId =  {menuGroupCode: row.menuGroupCode, menuCode: row.menuCode};
  }
  //#endregion 메뉴

}

import { Component, OnInit, viewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzPageHeaderCustom } from '@src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom';
import { NzSearchArea } from '@src/app/third-party/ng-zorro/nz-search-area/nz-search-area';
import { NgPage } from '@src/app/core/app/nz-page';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { TermGrid } from './term-grid';
import { TermFormDrawer } from './term-form-drawer';
import { DataDomainGrid } from './data-domain-grid';
import { DataDomainFormDrawer } from "./data-domain-form-drawer";

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';


@Component({
  selector: 'term-app',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzDrawerModule,
    NzTabsModule,
    NzGridModule,
    NzDividerModule,
    NzSelectModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzPageHeaderCustom,
    NzSearchArea,
    NzSpaceModule,
    DataDomainFormDrawer,
    DataDomainGrid,
    TermFormDrawer,
    TermGrid,
    NgPage,

],
  template: `
<ng-template #header>
  <nz-page-header-custom title="용어사전 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <nz-search-area>
    <div nz-row>
      <div nz-col [nzSpan]="12">
        <nz-space-compact nzBlock>
          <nz-select [(ngModel)]="query.term.key">
            @for (option of query.term.list; track option.value) {
            <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
            }
          </nz-select>
          <nz-input-search>
            <input type="text" [(ngModel)]="query.term.value" nz-input placeholder="input search text" (keyup.enter)="getTermList()">
          </nz-input-search>
        </nz-space-compact>
      </div>

      <div nz-col [nzSpan]="12" style="text-align: right;">
        <button nz-button (click)="getTermList()">
          <span nz-icon nzType="search"></span>조회
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button nz-button (click)="newTerm()">
          <span nz-icon nzType="form" nzTheme="outline"></span>신규 용어
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button nz-button (click)="newDomain()">
          <span nz-icon nzType="form" nzTheme="outline"></span>신규 도메인
        </button>
      </div>
    </div>
  </nz-search-area>
</ng-template>

<ng-page [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <nz-tabs [nzSelectedIndex]="tabIndex">
    <nz-tab nzTitle="용어사전">
      <div [style.height]="'calc(100vh - var(--page-header-height) - var(--page-search-height) - 155px)'">
        @defer {
        <term-grid
          (rowClicked)="termGridSelected($event)"
          (editButtonClicked)="editTerm($event)"
          (rowDoubleClicked)="editTerm($event)">
        </term-grid>
        }
      </div>
    </nz-tab>

    <nz-tab nzTitle="도메인">
      <div [style.height]="'calc(100vh - var(--page-header-height) - var(--page-search-height) - 155px)'">
        @defer {
        <data-domain-grid
          (rowClicked)="domainGridSelected($event)"
          (editButtonClicked)="this.drawer().domain.visible = true"
          (rowDoubleClicked)="this.drawer().domain.visible = true">
        </data-domain-grid>
        }
      </div>
    </nz-tab>
  </nz-tabs>
</ng-page>

<!--
<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="25%"
  [nzVisible]="drawer().term.visible"
  nzTitle="용어 등록"
  (nzOnClose)="this.drawer().term.visible = false">
    <term-form *nzDrawerContent
      #termForm
      [formDataId]="drawer().term.formDataId"
      (formSaved)="getTermList()"
      (formDeleted)="getTermList()"
      (formClosed)="this.drawer().term.visible = false">
    </term-form>
</nz-drawer>
      -->

<term-form-drawer
  [drawer]="drawer().term"
  (drawerClosed)="getTermList()">
</term-form-drawer>

<data-domain-form-drawer
  [drawer]="drawer().domain"
  (drawerClosed)="getDomainList()">
</data-domain-form-drawer>

<!--
<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="25%"
  [nzVisible]="drawer.domain.visible"
  nzTitle="도메인 등록"
  (nzOnClose)="drawer.domain.visible = false">
    <data-domain-form *nzDrawerContent #doaminForm
      [formDataId]="drawer.domain.formDataId"
      (formSaved)="getDomainList()"
      (formDeleted)="getDomainList()"
      (formClosed)="drawer.domain.visible = false">
    </data-domain-form>
</nz-drawer>
      -->

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

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
  `
})
export default class AppTerm implements OnInit {

  termGrid = viewChild.required(TermGrid);
  domainGrid = viewChild.required(DataDomainGrid);

  query: {
    term : { key: string, value: string, list: {label: string, value: string}[] }
  } = {
    term : {
      key: 'term',
      value: '',
      list: [
        {label: '용어', value: 'term'},
        {label: '업무영역', value: 'domain'}
      ]
    }
  }

  /*
  drawer: {
    term: { visible: boolean, formDataId: any },
    word: { visible: boolean, formDataId: any },
    domain: { visible: boolean, formDataId: any }
  } = {
    term: { visible: false, formDataId: null },
    word: { visible: false, formDataId: null },
    domain: { visible: false, formDataId: null },
  }
  */

  drawer = signal({
    term: { visible: false, formDataId: '' },
    word: { visible: false, formDataId: '' },
    domain: { visible: false, formDataId: '' },
  });

  tabIndex: number = 0;

  ngOnInit(): void {
  }

  getList() {
    if (this.tabIndex === 0) {
      this.getTermList();
    } else if (this.tabIndex === 1) {
      this.getDomainList();
    }
  }

  //#region 용어사전
  getTermList() {
    let params: any = new Object();
    if ( this.query.term.value !== '') {
      params[this.query.term.key] = this.query.term.value;
    }

    this.drawer.update(current => ({...current, term: {visible: false, formDataId: current.term.formDataId}}));
    this.termGrid().gridQuery.set(params);
  }

  newTerm() {
    this.drawer.update(current => ({...current, term: {visible: true, formDataId: ''}}));
  }

  editTerm(item: any) {
    this.drawer.update(current => ({...current, term: {visible: true, formDataId: item.term}}));
  }

  termGridSelected(item: any) {
    this.drawer.update(current => ({...current, term: {visible: current.term.visible, formDataId: item.term}}));
  }
  //#endregion 용어사전

  //#region 도메인
  getDomainList() {
    this.drawer.update(current => ({...current, domain: {visible: false, formDataId: current.domain.formDataId}}));
    this.domainGrid().gridResource.reload();
  }

  newDomain() {
    this.drawer.update(current => ({...current, domain: {visible: true, formDataId: ''}}));
  }

  domainGridSelected(item: any) {
    this.drawer.update(current => ({...current, domain: {visible: current.domain.visible, formDataId: item.domainId}}));
  }
  //#endregion 도메인

}

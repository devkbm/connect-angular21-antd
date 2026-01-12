import { Component, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TermGrid } from './term-grid';
import { DataDomainGrid } from './data-domain-grid';
import { WordGrid } from './word-grid';
import { DataDomainForm } from './data-domain-form';
import { TermForm } from './term-form';
import { WordForm } from './word-form';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPageHeaderCustom } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom';
import { NzSearchArea } from 'src/app/third-party/ng-zorro/nz-search-area/nz-search-area';
import { NgPage } from "src/app/core/app/nz-page";
import { NzSpaceModule } from 'ng-zorro-antd/space';

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
    DataDomainForm,
    DataDomainGrid,
    TermForm,
    TermGrid,
    WordForm,
    WordGrid,
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
        <button nz-button (click)="newWord()">
          <span nz-icon nzType="form" nzTheme="outline"></span>신규 단어
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

    <nz-tab nzTitle="단어사전">
      <div [style.height]="'calc(100vh - var(--page-header-height) - var(--page-search-height) - 155px)'">
        @defer {
        <app-word-grid
          (rowClicked)="wordGridSelected($event)"
          (editButtonClicked)="editWord($event)"
          (rowDoubleClicked)="editWord($event)">
        </app-word-grid>
        }
      </div>
    </nz-tab>

    <nz-tab nzTitle="도메인">
      <div [style.height]="'calc(100vh - var(--page-header-height) - var(--page-search-height) - 155px)'">
        @defer {
        <data-domain-grid
          (rowClicked)="domainGridSelected($event)"
          (editButtonClicked)="this.drawer.domain.visible = true"
          (rowDoubleClicked)="this.drawer.domain.visible = true">
        </data-domain-grid>
        }
      </div>
    </nz-tab>
  </nz-tabs>
</ng-page>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawer.term.visible"
  nzTitle="용어 등록"
  (nzOnClose)="this.drawer.term.visible = false">
    <term-form *nzDrawerContent
      #termForm
      [formDataId]="drawer.term.formDataId"
      (formSaved)="getTermList()"
      (formDeleted)="getTermList()"
      (formClosed)="this.drawer.term.visible = false">
    </term-form>
</nz-drawer>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
  [nzVisible]="drawer.word.visible"
  nzTitle="단어 등록"
  (nzOnClose)="this.drawer.word.visible = false">
    <word-form *nzDrawerContent #wordForm
      [formDataId]="drawer.word.formDataId"
      (formSaved)="getWordList()"
      (formDeleted)="getWordList()"
      (formClosed)="drawer.word.visible = false">
    </word-form>
</nz-drawer>

<nz-drawer
  [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
  [nzMaskClosable]="true"
  nzWidth="80%"
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
export class TermApp implements OnInit {

  termGrid = viewChild.required(TermGrid);
  wordGrid = viewChild.required(WordGrid);
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

  drawer: {
    term: { visible: boolean, formDataId: any },
    word: { visible: boolean, formDataId: any },
    domain: { visible: boolean, formDataId: any }
  } = {
    term: { visible: false, formDataId: null },
    word: { visible: false, formDataId: null },
    domain: { visible: false, formDataId: null },
  }

  tabIndex: number = 0;

  ngOnInit(): void {
  }

  getList() {
    if (this.tabIndex === 0) {
      this.getTermList();
    } else if (this.tabIndex === 1) {
      this.getWordList();
    } else if (this.tabIndex === 2) {
      this.getDomainList();
    }
  }

  //#region 용어사전
  getTermList() {
    let params: any = new Object();
    if ( this.query.term.value !== '') {
      params[this.query.term.key] = this.query.term.value;
    }

    this.drawer.term.visible = false;
    this.termGrid().gridQuery.set(params);
  }

  newTerm() {
    this.drawer.term.formDataId = null;
    this.drawer.term.visible = true;
  }

  editTerm(item: any) {
    this.drawer.term.formDataId = item.termId;
    this.drawer.term.visible = true;
  }

  termGridSelected(item: any) {
    this.drawer.term.formDataId = item.termId;
  }
  //#endregion 용어사전

  //#region 단어사전
  getWordList() {
    this.drawer.word.visible = false;
    this.wordGrid().gridResource.reload();
  }

  newWord() {
    this.drawer.word.formDataId = null;
    this.drawer.word.visible = true;
  }

  editWord(item: any) {
    this.drawer.word.formDataId = item.logicalName;
    this.drawer.word.visible = true;
  }

  wordGridSelected(item: any) {
    this.drawer.word.formDataId = item.logicalName;
  }
  //#endregion 단어사전

  //#region 도메인
  getDomainList() {
    this.drawer.domain.visible = false;
    this.domainGrid().gridResource.reload();
  }

  newDomain() {
    this.drawer.domain.formDataId = null;
    this.drawer.domain.visible = true;
  }

  domainGridSelected(item: any) {
    this.drawer.domain.formDataId = item.domainId;
  }
  //#endregion 도메인

}

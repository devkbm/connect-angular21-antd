import { Component, OnInit, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HrmCodeTypeGridComponent } from './hrm-code-type-grid';
import { HrmCodeGridComponent } from './hrm-code-grid';
import { NotifyService } from 'src/app/core/service/notify.service';
import { HrmCodeService } from '../shared/hrm-code.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { HrmCodeTypeService } from '../shared/hrm-code-type.service';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPageHeaderCustom } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom';
import { HrmCodeTypeFormDrawerComponent } from './hrm-code-type-form-drawer';
import { HrmCodeFormDrawerComponent } from './hrm-code-form-drawer';
import { NgPage } from "src/app/core/app/nz-page";


export interface HrmType {
  typeId: string | null;
  typeName: string | null;
  sequence: number | null;
  comment: string | null;
  fieldConfig: string | null;
  /*
  the1AddInfoDesc: string | null;
	the2AddInfoDesc: string | null;
	the3AddInfoDesc: string | null;
	the4AddInfoDesc: string | null;
	the5AddInfoDesc: string | null;
  */
}

export interface HrmCode {
  typeId: string | null;
  code: string | null;
  codeName: string | null;
  useYn: boolean | null;
  sequence: number | null;
  comment: string | null;
  fieldConfig: string | null;
  extraInfo: any;
}





@Component({
  selector: 'hrm-code-app',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzGridModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    NzDrawerModule,
    NzSelectModule,
    NzPageHeaderModule,
    NzInputModule,
    NzPageHeaderCustom,
    HrmCodeTypeGridComponent,
    HrmCodeTypeFormDrawerComponent,
    HrmCodeGridComponent,
    HrmCodeFormDrawerComponent,
    NgPage
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="인사시스템 코드 정보" subtitle="인사시스템 구분 코드 정보 관리"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <div nz-row class="btn-group">

    <div nz-col [nzSpan]="24" class="text-right">
      <button nz-button (click)="newHrmCodeType()">
        <span nz-icon nzType="form"></span>코드분류등록
      </button>
      <nz-divider nzType="vertical"></nz-divider>

      <button nz-button (click)="newHrmCode()">
        <span nz-icon nzType="form"></span>코드등록
      </button>
      <nz-divider nzType="vertical"></nz-divider>

      <button nz-button (click)="getGridHrmCodeType()">
        <span nz-icon nzType="form"></span>조회
      </button>
    </div>
  </div>
</ng-template>

<ng-page [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="grid-2row-2col">
      <h3 class="header1">코드 분류 목록 {{drawer.codeType | json}}</h3>
      <hrm-code-type-grid #gridHrmType
        [list]="gridHrmCodeTypeList"
        (rowClicked)="rowClickHrmCodeType($event)"
        (rowDoubleClicked)="editHrmCodeType($event)"
        (editButtonClicked)="editHrmCodeType($event)">
      </hrm-code-type-grid>

      <h3 class="header2">코드 목록 {{drawer.code | json}}</h3>
      <hrm-code-grid #gridHrmTypeCode
        [list]="gridHrmCodeList"
        (rowClicked)="rowClickHrmCode($event)"
        (rowDoubleClicked)="editHrmCode($event)"
        (editButtonClicked)="editHrmCode($event)">
      </hrm-code-grid>
  </div>
</ng-page>

<hrm-code-type-form-drawer
  [drawer]="drawer.codeType"
  (drawerClosed)="getGridHrmCodeType()">
</hrm-code-type-form-drawer>

<hrm-code-form-drawer
  [drawer]="drawer.code"
  (drawerClosed)="getGridHrmCode()">
</hrm-code-form-drawer>
  `,
  styles: `
.btn-group {
  padding: 6px;
  /*background: #fbfbfb;*/
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding-left: auto;
  padding-right: 5;
}

.grid-2row-2col {
  height: 100%;
  display: grid;
  grid-template-rows: 34px 1fr;
  grid-template-columns: 1fr 1fr;
  column-gap: 12px;
  grid-template-areas:
    "header1 header2"
    "grid1   grid2";
}

.header1 {
  grid-area: header1;
  padding-left: 5px;
  border-left: 5px solid green;
}

.header2 {
  grid-area: header2;
  padding-left: 5px;
  border-left: 5px solid green;
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

.text-right {
  text-align: right;
}

  `
})
export class HrmCodeApp implements OnInit {

  private notifyService = inject(NotifyService);
  private hrmCodeService = inject(HrmCodeService);
  private hrmCodeTypeService = inject(HrmCodeTypeService);

  gridHrmCodeType = viewChild.required(HrmCodeTypeGridComponent);
  gridHrmCode = viewChild.required(HrmCodeGridComponent);

  gridHrmCodeTypeList: HrmType[] = [];
  gridHrmCodeList: HrmCode[] = [];

  drawer: {
    codeType: { visible: boolean, formDataId: any },
    code: { visible: boolean, formDataId: {typeId: any, code: any} | null }
  } = {
    codeType: { visible: false, formDataId: null },
    code: { visible: false, formDataId: null }
  }

  ngOnInit() {
    this.getGridHrmCodeType();
  }

  getGridHrmCodeType(): void {
    this.drawer.codeType.visible = false;
    this.getGridHrmCodeTypeList('');
  }

  rowClickHrmCodeType(row: any): void {
    this.drawer.codeType.formDataId = row.typeId;
    this.drawer.code.formDataId = {typeId: row.typeId, code: ''};

    this.gridHrmCodeGridList(row.typeId);
  }

  newHrmCodeType(): void {
    this.drawer.codeType.formDataId = null;
    this.drawer.codeType.visible = true;
  }

  editHrmCodeType(row: any): void {
    this.drawer.codeType.formDataId = row.typeId;
    this.drawer.codeType.visible = true;
  }

  rowClickHrmCode(row: any): void {
    this.drawer.code.formDataId = {typeId: row.typeId, code: row.code};
  }

  getGridHrmCode(): void {
    this.drawer.code.visible = false;
    this.gridHrmCodeGridList(this.drawer.codeType.formDataId);
  }

  newHrmCode(): void {
    this.drawer.code.formDataId = {typeId: this.drawer.codeType.formDataId, code: null};
    this.drawer.code.visible = true;
  }

  editHrmCode(row: any): void {
    this.drawer.code.formDataId = {typeId: row.typeId, code: row.code};
    this.drawer.code.visible = true;
  }

  public gridHrmCodeGridList(typeId: string): void {
    const params = {
      typeId : typeId
    };

    this.hrmCodeService
        .getList(params)
        .subscribe(
          (model: ResponseList<HrmCode>) => {
            this.gridHrmCodeList = model.data;
          }
        );
  }

  getGridHrmCodeTypeList(hrmType: string): void {
    const params = {
      hrmType : hrmType
    };

    this.hrmCodeTypeService
        .getList(params)
        .subscribe(
          (model: ResponseList<HrmType>) => {
            this.gridHrmCodeTypeList = model.data;
          }
        );
  }

}


import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';
import { ButtonRenderer } from 'src/app/third-party/ag-grid/renderer/button-renderer';
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

import { NotifyService } from 'src/app/core/service/notify.service';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { GlobalProperty } from 'src/app/core/global-property';
import { ResponseList } from 'src/app/core/model/response-list';


export interface AttendanceApplicationGrid {
  id: string | null;
  staffNo: string | null;
  staffName: string | null;
  dutyCode: string | null;
  dutyName: string | null;
  dutyReason: string | null;
  fromDate: string | null;
  toDate: string | null;
}


@Component({
  selector: 'attendance-application-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="_data"
      [style.height]="'100%'"
      [rowSelection]="rowSelection"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (selectionChanged)="selectionChanged($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
    </ag-grid-angular>
  `,
  styles: [`
  `]
})
export class AttendanceApplicationGridComponent extends AgGridCommon implements OnInit {

  private notifyService = inject(NotifyService);
  private http = inject(HttpClient);

  _data: AttendanceApplicationGrid[] = [];

  rowClicked = output<AttendanceApplicationGrid>();
  rowDoubleClicked = output<AttendanceApplicationGrid>();
  editButtonClicked = output<AttendanceApplicationGrid>();

  columnDefs: ColDef[] = [
    {
      headerName: '',
      width: 40,
      cellStyle: {'text-align': 'center', 'padding': '0px'},
      cellRenderer: ButtonRenderer,
      cellRendererParams: {
        onClick: this.onEditButtonClick.bind(this),
        label: '',
        iconType: 'form'
      }
    },
    {
      headerName: 'No',
      valueGetter: 'node.rowIndex + 1',
      width: 70,
      cellStyle: {'text-align': 'center'}
    },
    { headerName: '근태신청ID',         field: 'id',              width: 80 },
    { headerName: '사원번호',           field: 'staffNo',             width: 80 },
    { headerName: '사원명',             field: 'staffName',             width: 80 },
    { headerName: '근태코드',           field: 'dutyCode',            width: 80 },
    { headerName: '근태구분',           field: 'dutyName',            width: 80 },
    { headerName: '근태사유',           field: 'dutyReason',          width: 80 },
    { headerName: '근태시작일시',       field: 'fromDate',   width: 80 },
    { headerName: '근태근태종료일시',   field: 'toDate',     width: 80 }
  ];

  getRowId: GetRowIdFunc<AttendanceApplicationGrid> = (params: GetRowIdParams<AttendanceApplicationGrid>) => {
    return params.data.id!;
  };

  ngOnInit() {
    //this.getGridList('TEST');
    this.getList('TEST');
  }

  public getGridList(staffNo: string): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/dutyapplication`;
    const options = getHttpOptions({staffId : staffNo});

    this.http.get<ResponseList<AttendanceApplicationGrid>>(url, options).pipe(
      //catchError(this.handleError<ResponseList<DutyApplicationGrid>>('getDutyApplicationList', undefined))
    ).subscribe(
      (model: ResponseList<AttendanceApplicationGrid>) => {
        if (model.data) {
          this._data = model.data;
        } else {
          this._data = [];
        }
        this.notifyService.changeMessage(model?.message);
      }
    )


  }

  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: RowDoubleClickedEvent<AttendanceApplicationGrid>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

  // GlobalProperty.serverUrl()



  getList(params: any) {
    const url = GlobalProperty.serverUrl() + `/api/hrm/dutyapplication`;
    const options = getHttpOptions(params);

    this.http.get<ResponseList<AttendanceApplicationGrid>>(url, options).pipe(
      //catchError(this.handleError<ResponseList<DutyApplicationGrid>>('getDutyApplicationList', undefined))
    ).subscribe(
      (model: ResponseList<AttendanceApplicationGrid>) => {
        if (model.data) {
          this._data = model.data;
        } else {
          this._data = [];
        }
      }
    );
  }

}


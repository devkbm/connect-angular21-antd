import { ChangeDetectionStrategy, Component, effect, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { ButtonRenderer } from 'src/app/third-party/ag-grid/renderer/button-renderer';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

import { ResponseList } from 'src/app/core/model/response-list';

import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { HttpClient } from '@angular/common/http';


export interface PartnerStaff {
  companyCode: string | null;
  staffNo: string | null;
  name: string | null;
  nameEng: string | null;
  nameChi: string | null;
  gender: string | null;
  birthday: Date | null;
  partnerCompanyCode: string | null;
  joinDate: Date | null;
  retireDate: Date | null;
  blngDeptCode: string | null;
  workDeptCode: string | null;
}

@Component({
  selector: 'partner-staff-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="gridResource.value()?.data ?? []"
      [style.height]="'100%'"
      [rowSelection]="rowSelection"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (rowClicked)="rowClickedEvent($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
    </ag-grid-angular>
  `,
  styles: `
    ag-grid-angular {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerStaffGrid extends AgGridCommon {

  private http = inject(HttpClient);

  rowClicked = output<PartnerStaff>();
  rowDoubleClicked = output<PartnerStaff>();
  editButtonClicked = output<PartnerStaff>();

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
    { headerName: '리소스ID',     field: 'resourceId',      width: 150 },
    { headerName: '리소스명',     field: 'resourceName',    width: 200 },
    { headerName: '리소스타입',   field: 'resourceType',    width: 200 },
    { headerName: 'Url',          field: 'url',             width: 200 },
    { headerName: '설명',         field: 'description',     width: 300 }
  ];

  getRowId: GetRowIdFunc<PartnerStaff> = (params: GetRowIdParams<PartnerStaff>) => {
    return params.data.staffNo!;
  };

  gridQuery = signal<any>('');
  gridResource = rxResource({
    params: () => this.gridQuery(),
    stream: ({params}) => this.http.get<ResponseList<PartnerStaff>>(
      GlobalProperty.serverUrl() + `/api/system/webresource`,
      getHttpOptions(params)
    )
  })

  rowClickedEvent(event: RowClickedEvent<PartnerStaff>) {
    this.rowClicked.emit(event.data!);
  }

  rowDbClicked(event: RowDoubleClickedEvent<PartnerStaff>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}


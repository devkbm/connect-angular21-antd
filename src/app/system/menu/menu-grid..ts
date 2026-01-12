import { Component, Input, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
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

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseList } from 'src/app/core/model/response-list';

export interface Menu {
  menuGroupCode: string | null;
  menuCode: string | null;
  menuName: string | null;
  menuType: string | null;
  parentMenuCode: string | null;
  sequence: number | null;
  appUrl: string | null;
  appIconType: string | null;
  appIcon: string | null;
}


@Component({
  selector: 'menu-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="gridResource.hasValue() ? gridResource.value().data! : []"
      [style.height]="'100%'"
      [rowSelection]="rowSelection"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (selectionChanged)="selectionChanged($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
  </ag-grid-angular>
  `
})
export class MenuGrid extends AgGridCommon {

  private http = inject(HttpClient);

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  @Input() menuGroupCode: string = '';

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
      width: 50,
      cellStyle: {'text-align': 'center'}
    },
    {headerName: '메뉴그룹코드',  field: 'menuGroupCode',   width: 100 },
    {headerName: '메뉴코드',      field: 'menuCode',        width: 80},
    {headerName: '메뉴명',        field: 'menuName',        width: 130},
    {headerName: '메뉴타입',      field: 'menuType',        width: 100 },
    {headerName: '상위메뉴코드',  field: 'parentMenuCode',  width: 100 },
    {headerName: '순번',          field: 'sequence',        width: 60},
    {headerName: 'APP URL',       field: 'appUrl',          width: 300 }
  ];

  getRowId: GetRowIdFunc<Menu> = (params: GetRowIdParams<Menu>) => {
      return params.data.menuGroupCode! + params.data.menuCode!;
  };

  gridQuery = signal<any>({});
  gridResource = rxResource({
    params: () => this.gridQuery(),
    stream: ({params}) => this.http.get<ResponseList<Menu>>(
      GlobalProperty.serverUrl() + `/api/system/menu`,
      getHttpOptions(params)
    )
  })

  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: RowDoubleClickedEvent<Menu>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }
}

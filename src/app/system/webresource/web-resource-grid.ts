import { Component, effect, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { themeBalham, GetRowIdFunc, GetRowIdParams, RowSelectionOptions, colorSchemeDark } from 'ag-grid-community';
import { ButtonRenderer } from 'src/app/third-party/ag-grid/renderer/button-renderer';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { HttpClient } from '@angular/common/http';

export interface WebResource {
  resourceId: string | null;
  resourceName: string | null;
  resourceType: string | null;
  url: string | null;
  description: string | null;
}

@Component({
  selector: 'web-resource-grid',
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
  styles: [`

    ag-grid-angular {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  `]
})
export class WebResourceGrid extends AgGridCommon {

  private http = inject(HttpClient);

  rowClicked = output<WebResource>();
  rowDoubleClicked = output<WebResource>();
  editButtonClicked = output<WebResource>();

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

  getRowId: GetRowIdFunc<WebResource> = (params: GetRowIdParams<WebResource>) => {
    return params.data.resourceId!;
  };

  gridQuery = signal<any>('');
  gridResource = rxResource({
    params: () => this.gridQuery(),
    stream: ({params}) => this.http.get<ResponseList<WebResource>>(
      GlobalProperty.serverUrl() + `/api/system/webresource`,
      getHttpOptions(params)
    )
  })

  rowClickedEvent(event: RowClickedEvent<WebResource>) {
    this.rowClicked.emit(event.data!);
  }

  rowDbClicked(event: RowDoubleClickedEvent<WebResource>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}

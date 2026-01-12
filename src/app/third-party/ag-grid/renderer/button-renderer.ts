import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-button-renderer',
  imports: [
    NzButtonModule,
    NzIconModule
  ],
  template: `
    <!-- [style.width]="'24px'" -->
    <button nz-button nzSize="small" (click)="onClick($event)"  >
      <nz-icon [nzType]="iconType" class="icon"/>
      {{label}}
    </button>
  `,
  styles: [`
    [nz-button] {
      margin: 0px;
      padding-left: 2.5px;
      padding-right: 2.5px;
    }
    .icon {
      font-size: 16px;
      color: #08c;
    }
  `]
})
export class ButtonRenderer implements ICellRendererAngularComp {

  params: any;
  label: string = '';
  iconType: string= '';

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.label = this.params.label || null;
    this.iconType = this.params.iconType || null;
  }

  refresh(params: any): boolean {
    return true;
  }

  onClick($event: any): void {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
      };

      this.params.onClick(params);
    }
  }


}

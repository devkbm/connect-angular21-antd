import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'app-checkbox-renderer',
  imports: [ FormsModule, NzCheckboxModule ],
  template: `
    <label nz-checkbox [(ngModel)]="_value" [nzDisabled]="disabled" (click)="onClick($event)" (change)="onChange($event)">
      {{label}}
    </label>
  `,
  styles: []
})
export class CheckboxRenderer implements ICellRendererAngularComp {

  params: any;
  disabled: boolean = false;
  label: string = '';
  _value: any;

  agInit(params: ICellRendererParams): void {
    this.params = params;

    this.label = this.params.label || null;
    this.disabled = this.params.disabled;
    this._value = params.data[this.params.colDef.field];
  }

  refresh(params: any): boolean {
    return true;
  }

  onClick($event: any) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
      };

      this.params.onClick(params);
    }
  }

  onChange(event: any) {
    this.params.data[this.params.colDef.field] = this._value;
  }


}

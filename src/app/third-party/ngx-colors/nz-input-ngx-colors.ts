import { Component, ElementRef, Input, OnInit, viewChild, inject } from '@angular/core';
import { ControlValueAccessor, NgControl, FormsModule } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';

import { NgxColorsModule } from 'ngx-colors';

@Component({
  selector: 'nz-input-ngx-colors',
  imports: [FormsModule, NzFormModule, NgxColorsModule],
  template: `
    <ngx-colors #input ngx-colors-trigger
      [(ngModel)]="_value"
      [palette]="colorPalette"
      [hideColorPicker]="true"
      [hideTextInput]="true"
      (ngModelChange)="onChange($event)"
      (blur)="onTouched()">
    </ngx-colors>
  `,
  styles: []
})
export class NzInputNgxColors implements ControlValueAccessor, OnInit {

  element = viewChild.required<ElementRef>('input');

  @Input() itemId: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;

  @Input() colorPalette: Array<any> = [
    "#00BCD4",
    "#03A9F4",
    "#B2F35C",
  ];

  _value: any;

  onChange!: (value: any) => void;
  onTouched!: () => void;

  private ngControl = inject(NgControl, { self: true, optional: true });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    //this.control.nzValidateStatus = this.ngControl.control as AbstractControl;
  }

  writeValue(obj: any): void {
    this._value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  focus(): void {
    this.element().nativeElement.focus();
  }

}

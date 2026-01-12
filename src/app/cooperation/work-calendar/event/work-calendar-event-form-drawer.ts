import { Component, input, output, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';

import { NzCrudButtonGroup } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group';
import { NewFormValue, WorkCalendarEventForm } from './work-calendar-event-form';

@Component({
  selector: 'work-calendar-event-form-drawer',
  imports: [
    CommonModule,
    NzDrawerModule,
    NzCrudButtonGroup,
    WorkCalendarEventForm
  ],
  template: `
    <nz-drawer
      [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
      [nzMaskClosable]="true"
      [nzWidth]="720"
      [nzVisible]="drawer().visible"
      nzTitle="일정 등록"
      [nzFooter]="footerTpl"
      (nzOnClose)="drawer().visible = false">

      <work-calendar-event-form *nzDrawerContent
        [formDataId]="drawer().formDataId"
        [newFormValue]="newFormValue()"
        (formSaved)="closeDrawer($event)"
        (formDeleted)="closeDrawer($event)"
        (formClosed)="drawer().visible = false">
      </work-calendar-event-form>
    </nz-drawer>

    <ng-template #footerTpl>
      <div style="float: right">
        <app-nz-crud-button-group
          [searchVisible]="false"
          [isSavePopupConfirm]="false"
          (closeClick)="closeDrawer()"
          (saveClick)="save()"
          (deleteClick)="remove()">
        </app-nz-crud-button-group>
      </div>
    </ng-template>
  `,
  styles: []
})
export class WorkCalendarEventFormDrawer {

  newFormValue = input<NewFormValue>();

  drawer = input.required<{visible: boolean, formDataId: any}>();
  drawerClosed = output<any>();

  form = viewChild.required<WorkCalendarEventForm>(WorkCalendarEventForm);

  save() {
    this.form().save();
  }

  remove() {
    this.form().remove();
  }

  closeDrawer(params?: any) {
    this.form().closeForm();

    this.drawerClosed.emit(params);
  }

}

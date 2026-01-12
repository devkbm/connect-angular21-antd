import { Component, input, output, viewChild } from '@angular/core';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';

import { NzCrudButtonGroup } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group';
import { WorkCalendarForm } from './work-calendar-form';

@Component({
  selector: 'work-calendar-form-drawer',
  imports: [
    NzDrawerModule,
    NzCrudButtonGroup,
    WorkCalendarForm
  ],
  template: `
    <nz-drawer
      [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
      [nzMaskClosable]="true"
      [nzWidth]="720"
      [nzVisible]="drawer().visible"
      nzTitle="CALENDAR 등록"
      [nzFooter]="footerTpl"
      (nzOnClose)="drawer().visible = false">

      <work-calendar-form *nzDrawerContent
        [formDataId]="drawer().formDataId"
        (formSaved)="closeDrawer($event)"
        (formDeleted)="closeDrawer($event)"
        (formClosed)="drawer().visible = false">
      </work-calendar-form>
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
export class WorkCalendarFormDrawer {

  drawer = input.required<{visible: boolean, formDataId: any}>();
  drawerClosed = output<any>();

  form = viewChild.required<WorkCalendarForm>(WorkCalendarForm);

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

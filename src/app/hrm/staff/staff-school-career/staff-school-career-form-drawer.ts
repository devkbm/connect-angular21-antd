import { Component, input, output, viewChild } from '@angular/core';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCrudButtonGroup } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group';
import { StaffSchoolCareerForm } from './staff-school-career-form';

@Component({
  selector: 'staff-school-career-form-drawer',
  imports: [
    NzDrawerModule,
    NzCrudButtonGroup,
    StaffSchoolCareerForm
  ],
  template: `
  <nz-drawer
      nzTitle="학력 등록"
      nzWidth="80%"
      [nzMaskClosable]="true"
      [nzVisible]="drawer().visible"
      [nzFooter]="footerTpl"
      (nzOnClose)="drawer().visible = false">
        <staff-school-career-form *nzDrawerContent
          [formDataId]="drawer().formDataId"
          [staff]="selectedStaff()"
          (formSaved)="closeDrawer($event)"
          (formDeleted)="closeDrawer($event)"
          (formClosed)="drawer().visible = false">
        </staff-school-career-form>
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
export class StaffSchoolCareerFormDrawer {

  drawer = input.required<{visible: boolean, formDataId: any}>();
  drawerClosed = output<any>();

  form = viewChild.required<StaffSchoolCareerForm>(StaffSchoolCareerForm);

  selectedStaff = input<any>();

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

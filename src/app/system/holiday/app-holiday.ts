import { AfterViewInit, Component, inject, viewChild } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ResponseObject } from 'src/app/core/model/response-object';
import { NgPage } from "src/app/core/app/nz-page";
import { NotifyService } from 'src/app/core/service/notify.service';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

import { NzPageHeaderCustom } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom';
import { CalendarDaypilotNavigatorComponent } from 'src/app/third-party/daypilot/calendar-daypilot-navigator.component';
import { CalendarFullcalendar } from "src/app/third-party/fullcalendar/calendar-fullcalendar/calendar-fullcalendar";

import { HolidayFormDrawer } from './holiday-form-drawer';
import { HolidayGrid } from './holiday-grid';
import { HolidaySearch } from "./holiday-search";

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

export interface DateInfo {
  date: Date | null;
  dayOfWeek: string | null;
  holiday: Holiday | null;
  saturDay: boolean;
  sunday: boolean;
  weekend: boolean;
}

export interface Holiday {
  date: Date | null;
  holidayName: string | null;
  comment: string | null;
}


@Component({
  selector: 'holiday-app',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzIconModule,
    NzButtonModule,
    NzTabsModule,
    NzDatePickerModule,
    NzDividerModule,
    NzPageHeaderCustom,

    HolidayGrid,
    HolidayFormDrawer,
    CalendarDaypilotNavigatorComponent,
    NgPage,
    CalendarFullcalendar,
    HolidaySearch,
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="공휴일 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <holidary-search
    (search)="getHolidayList()"
    (newForm)="newHoliday()"
    (deleteForm)="deleteHoliday()"
  >
  </holidary-search>
</ng-template>

<ng-page [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <nz-tabs [(nzSelectedIndex)]="tab.index">
    <nz-tab nzTitle="달력">
    <ng-template nz-tab>
      <div [style]="'height: calc(100vh - 272px)'">

        <app-calendar-fullcalendar
          (dayClicked)="newHoliday2($event)"
        ></app-calendar-fullcalendar>

      </div>
    </ng-template>
    </nz-tab>

    <nz-tab nzTitle="공휴일 등록">
      <ng-template nz-tab>
        <h3 class="grid-title">공휴일 목록</h3>
        <div class="grid-wrapper" >
          <holiday-grid
            (rowClicked)="holidayGridRowClicked($event)"
            (editButtonClicked)="edit($event)"
            (rowDoubleClicked)="edit($event)">
          </holiday-grid>


          <calendar-daypilot-navigator
            [events]="grid().filteredList()"
            (selectChanged)="navigatorSelectChanged($event)">
          </calendar-daypilot-navigator>

        </div>
      </ng-template>
    </nz-tab>
  </nz-tabs>
</ng-page>

<holiday-form-drawer
  [drawer]="drawer.holiday"
  (drawerClosed)="getHolidayList()">
</holiday-form-drawer>

  `,
  styles: `
:host {
  --page-header-height: 98px;
  --page-search-height: 46px;
}

.grid-title {
  margin-left: 6px;
  border-left: 6px solid green;
  padding-left: 6px;
  vertical-align: text-top;
}

.grid-wrapper {
  height: calc(100vh - 306px);
  display: grid;
  grid-template-columns: 1fr 200px;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

  `
})
export class HolidayApp implements AfterViewInit {

  private notifyService = inject(NotifyService);
  private http = inject(HttpClient);

  grid = viewChild.required(HolidayGrid);
  calendar = viewChild.required(CalendarFullcalendar);
  search = viewChild.required(HolidaySearch);

  drawer: {
    holiday: { visible: boolean, formDataId: any }
  } = {
    holiday: { visible: false, formDataId: null }
  }

  tab: {
    index: number
  } = {
    index : 0
  }

  ngAfterViewInit(): void {
    this.getHolidayList();
  }

  openDrawer(): void {
    this.drawer.holiday.visible = true;
  }

  closeDrawer(): void {
    this.drawer.holiday.visible = false;
  }

  getHolidayList(): void {

    this.closeDrawer();

    const date: Date = this.search().query.holiday.year;

    if ( this.tab.index == 0 ) {
      this.calendar().getHolidayList(date.getFullYear()+'0101', date.getFullYear()+'1231');
    } else {
      this.grid().gridQuery.set({fromDate: date.getFullYear()+'0101', toDate: date.getFullYear()+'1231'});
    }

  }

  newHoliday2(selectInfo: any) {
  //newHoliday2(selectInfo: DateSelectArg) {
    console.log(selectInfo);

    this.drawer.holiday.formDataId = selectInfo.startStr;
    this.openDrawer();
  }

  newHoliday(): void {
    this.drawer.holiday.formDataId = null;
    this.openDrawer();
  }

  deleteHoliday(): void {
    const date = this.grid().getSelectedRows()[0].date;
    this.delete(date);
  }

  delete(date: Date): void {
    const id = formatDate(date, 'yyyyMMdd','ko-kr') as string;
    if (id === null) return;

    const url = GlobalProperty.serverUrl() + `/holiday/${id}`;
    const options = getHttpOptions();

    this.http
        .delete<ResponseObject<Holiday>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<Holiday>>('deleteHoliday', undefined))
        )
        .subscribe(
          (model: ResponseObject<Holiday>) => {
            this.notifyService.changeMessage(model.message);
            this.getHolidayList();
          }
        );
  }

  holidayGridRowClicked(item: any): void {
    this.drawer.holiday.formDataId = item.date;
  }

  edit(item: any): void {
    this.drawer.holiday.formDataId = item.date;
    this.openDrawer();
  }

  navigatorSelectChanged(params: any) {
    //console.log(params);
    //console.log(params.start.value as Date);
    this.drawer.holiday.formDataId = params.start.value as Date;
    this.openDrawer();
  }
}

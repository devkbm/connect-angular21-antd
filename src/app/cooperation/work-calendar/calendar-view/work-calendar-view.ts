import { Component, Input, AfterViewInit, inject, viewChild, output } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';

import { ResponseList } from 'src/app/core/model/response-list';

import { ModeChangedArgs } from 'src/app/third-party/daypilot/calendar-daypilot.component';
import { CalendarFullcalendar } from "../../../third-party/fullcalendar/calendar-fullcalendar/calendar-fullcalendar";
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

export interface WorkCalendarEvent {
  id: string | null;
  text: string | null;
  start: string | Date | null;
  end: string | Date | null;
  allDay: boolean | null;
  workCalendarId: string | null;
  color?: string;
}

export interface NewDateSelectedArgs {
  workCalendarId: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

@Component({
  selector: 'work-calendar-view',
  imports: [
    CommonModule,
    CalendarFullcalendar
],
  template: `
    <app-calendar-fullcalendar
      (eventClicked)="eventClicked($event)"
      (dayClicked)="onDateClick($event)">
    </app-calendar-fullcalendar>
  `,
  styles: [`
    .calendar-div {
      /*max-height: 800px; */
      overflow-y: hidden;
      overflow-x: hidden;
      overflow: auto;
      height: 100%;
    }
`]
})
export class WorkCalendarView implements AfterViewInit {

  calendar2 = viewChild.required(CalendarFullcalendar);

  @Input() workCalendarId = '';

  itemSelected = output<any>();
  newDateSelected = output<NewDateSelectedArgs>();
  eventDataChanged = output<any>();
  visibleRangeChanged = output<{start: Date, end: Date, date: Date}>();
  modeChanged = output<ModeChangedArgs>();

  from!: string;
  to!: string;
  eventData: any[] = [];
  mode?: ModeChangedArgs;

  private http = inject(HttpClient);

  ngAfterViewInit(): void {
    //this.from = this.datePipe.transform(this.calendar.start.toDateLocal(),'yyyyMMdd') ?? '';
    //this.to = this.datePipe.transform(this.calendar.end.toDateLocal(),'yyyyMMdd') ?? '';

    //this.from = formatDate(this.calendar().displayStart.toDateLocal(),'YYYYMMdd','ko-kr') ?? '';
    //this.to = formatDate(this.calendar().displayEnd.toDateLocal(),'YYYYMMdd','ko-kr') ?? '';

    //console.log()

    // Fullcalendar
    this.from = formatDate(this.calendar2().calendar().getApi().view.activeStart,'yyyyMMdd','ko-kr') ?? '';
    this.to = formatDate(this.calendar2().calendar().getApi().view.activeEnd,'yyyyMMdd','ko-kr') ?? '';

    // console.log(this.calendar2().calendar().getApi().view.type);

    //this.from = '20250201';
    //this.to = '20250228';
  }

  rangeChanged(e: any): void {
    this.visibleRangeChanged.emit({start: e.start, end: e.end, date: e.date});

    //this.from = this.datePipe.transform(e.start,'yyyyMMdd') ?? '';
    //this.to = this.datePipe.transform(e.end,'yyyyMMdd') ?? '';

    this.from = formatDate(e.start,'YYYYMMdd','ko-kr') ?? '';
    this.to = formatDate(e.end,'YYYYMMdd','ko-kr') ?? '';

    this.getWorkScheduleList();
  }

  getWorkScheduleList(): void {
    const workGroupId: string = this.workCalendarId.toString();

    if (workGroupId === "" || workGroupId === null || workGroupId === undefined) {
      this.eventData = [];
      this.calendar2().setEvents([]);
      return;
    }

    const url =  GlobalProperty.serverUrl() + `/api/grw/workcalendarevent`;
    const options = getHttpOptions({
        fkWorkCalendar : this.workCalendarId,
        fromDate: this.from,
        toDate: this.to
      });

    this.http
        .get<ResponseList<WorkCalendarEvent>>(url, options).pipe(
       //     catchError(this.handleError<ResponseList<WorkCalendarEvent>>('getWorkScheduleList', undefined))
        )
        .subscribe(
          (model: ResponseList<WorkCalendarEvent>) => {
            /*
            let data: any[] = [];

            model.data.forEach(e => data.push({
              id: e.id,
              text: e.text,
              start: new DayPilot.Date(e.start as string),
              end: new DayPilot.Date(e.end as string),
              barColor: e.color
            }));
            this.eventData = data;
            this.eventDataChanged.emit(this.eventData);
            */

            let data2: any[] = [];

            model.data.forEach(e => data2.push({
              id: e.id,
              title: e.text,
              start: e.start as string,
              end: e.end as string,
              backgroundColor: e.color,
              allDay: e.allDay
            }));

            this.calendar2().setEvents(data2);
          }
      )

    // console.log(param);

  }

  eventClicked(param: any): void {

    //this.itemSelected.emit(param.id);

    this.itemSelected.emit(param.event.id);
  }

  onDateClick(params: any): void {
    let endDate: Date = params.end;
    let allDay: boolean = true;
    //console.log(this.calendar().mode());

    //if (this.calendar().mode() === 'Month') {
    if (this.calendar2().calendar().getApi().view.type === 'dayGridMonth') {
      // 선택한 날 + 1일 0시로 설정되어 있어서 전날 23시 59분 59초로 강제로 변경
      /*
      endDate = new Date(params.end);
      endDate.setDate(endDate.getDate() - 1);
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);
      endDate.setMilliseconds(999);
      */
      allDay = true;
    } else {

      allDay = false;
    }

    //console.log(endDate);

    const eventArgs: NewDateSelectedArgs = {workCalendarId: this.workCalendarId, start: params.start, end: endDate, allDay: allDay};
    this.newDateSelected.emit(eventArgs);
  }

  calendarModeChanged(params: ModeChangedArgs): void {
    //this.mode = params;
    //this.modeChanged.emit(this.mode);
  }

}

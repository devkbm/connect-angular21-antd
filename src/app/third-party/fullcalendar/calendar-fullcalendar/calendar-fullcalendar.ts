import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput, DateRangeInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

import ko from '@fullcalendar/core/locales/ko';

import { createEventId, INITIAL_EVENTS } from './event-util';
import { HolidayService } from 'src/app/system/holiday/holiday.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

export interface WorkCalendarEvent {
  id: string | null;
  text: string | null;
  start: string | Date | null;
  end: string | Date | null;
  allDay: boolean | null;
  workCalendarId: number | null;
  color?: string;
}

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
  selector: 'app-calendar-fullcalendar',
  imports: [CommonModule, FullCalendarModule],
  template: `
    <full-calendar [options]='calendarOptions()'>
      <ng-template #eventContent let-arg>
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </ng-template>
    </full-calendar>
  `,
  styles: `
    .fc { /* the calendar root */
      //height: calc(100vh - 300px);
      height: 100%;
      margin: 0 auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarFullcalendar {

  private http = inject(HttpClient);

  dayClicked = output<DateSelectArg>();
  eventClicked = output<EventClickArg>();

  calendar = viewChild.required(FullCalendarComponent);

  calendarOptions = signal<CalendarOptions>({
    locale: 'ko',
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed'
    //events: this.eventData,
    weekends: true,
    editable: false,
    eventStartEditable: false,
    selectable: true,
    //selectMirror: true,
    dayMaxEvents: true,
    dayCellClassNames: (arg) => {
      //const isHoliday = this.holidays.map((value: Date, index: number, array: Date[]): number => value.getTime())
      //                               .includes(arg.date.getTime());

      const isHoliday = this.holidayList().filter((value: DateInfo, index: number, array: DateInfo[]) => value.holiday !== null)
                                          .map((value: DateInfo, index: number, array: DateInfo[]): number => new Date(value.date!+'T00:00:00').getTime() )
                                          .includes(arg.date.getTime());
      //console.log(arg.date, arg.date.getTime(), isHoliday);
      if (isHoliday) {
        return [ 'fc-day-cell-holiday' ];
      }
      return '';
    },
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    //eventsSet: this.handleEvents.bind(this),
    /*
    dayHeaderClassNames: (arg) => {
      console.log(arg);
      return 'red';
    }
      */
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  currentEvents = signal<EventApi[]>([]);

  holidays : Date[] = [
    //new Date('2024-12-20T00:00:00'),
    //new Date('2024-12-25T00:00:00'),
  ];

  holidayList = signal<DateInfo[]>([]);

  holidayService = inject(HolidayService);
  changeDetector = inject(ChangeDetectorRef);

  constructor() {
    this.getHolidayList('20250101','20251231');
    this.getEvents();
  }

  getHolidayList(fromDate: string, toDate: string) {
    this.holidayService
          .getHolidayList(fromDate, toDate)
           .subscribe(
            (model: ResponseList<DateInfo>) => {
              //console.log(model.data);
              this.holidayList.set(model.data);
            }
          );
  }

  eventData: EventInput[] = [];

  getEvents() {
    const param = {
      fkWorkCalendar : 1,
      fromDate: '20250101',
      toDate: '20250131'
    };

    const url =  GlobalProperty.serverUrl() + `/api/grw/workcalendarevent`;
    const options = getHttpOptions({
        fkWorkCalendar : 1,
        fromDate: '20250101',
        toDate: '20250131'
      });

    this.http
        .get<ResponseList<WorkCalendarEvent>>(url, options).pipe(
          //catchError(this.handleError<ResponseList<WorkCalendarEvent>>('getWorkScheduleList', undefined))
        )
        .subscribe(
          (model: ResponseList<WorkCalendarEvent>) => {
            let data: any[] = [];

            model.data.forEach(e => data.push({
              id: e.id,
              title: e.text,
              start: e.start as string,
              end: e.end as string,
              barColor: e.color
            }));
            this.eventData = data;
            this.calendarOptions().events = this.eventData;
            this.changeDetector.detectChanges();
          }
      )
  }

  setEvents(events: any[]) {
    this.eventData = events;
    this.calendarOptions().events = this.eventData;
    this.changeDetector.detectChanges();
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.dayClicked.emit(selectInfo);
    /*
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
    */
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.eventClicked.emit(clickInfo);
    /*
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
      */
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }
}

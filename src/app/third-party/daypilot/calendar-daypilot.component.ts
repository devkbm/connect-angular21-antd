import {Component, AfterViewInit, Input, viewChild, output, model, signal, input, effect} from "@angular/core";
import {
  DayPilot,
  DayPilotCalendarComponent,
  DayPilotModule,
  DayPilotMonthComponent
} from "@daypilot/daypilot-lite-angular";
import { CalendarDaypilotHeaderComponent } from "./calendar-daypilot-header.component";

export interface ModeChangedArgs {
  readonly mode: "Day" | "Week" | "Month" | "None";
  readonly date: DayPilot.Date;
}

@Component({
  selector: 'app-calendar-daypilot',
  imports: [
    //CalendarDaypilotHeaderComponent,
    DayPilotModule
  ],
  template: `
    <div class="calendar">
      <div class="contents">
        @if (mode() === 'Day') {
          <daypilot-calendar #day [config]="configDay" [events]="events()"></daypilot-calendar>
        }

        @if (mode() === 'Week') {
          <daypilot-calendar #week [config]="configWeek" [events]="events()"></daypilot-calendar>
        }

        @if (mode() === 'Month') {
          <daypilot-month #month [config]="configMonth" [events]="events()"></daypilot-month>
        }
      </div>
    </div>
  `,
  styles: `
    .calendar {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      vertical-align: top;
    }

    /* 달력 높이 100%가 안됨 */
    .contents {
      flex: 0 0 100%;
    }
  `
})
export class CalendarDaypilotComponent implements AfterViewInit {

  day = viewChild.required<DayPilotCalendarComponent>('day');
  week = viewChild.required<DayPilotCalendarComponent>('week');
  month = viewChild.required<DayPilotMonthComponent>('month');

  mode = model<'Day' | 'Week' | 'Month' | 'None'>('Month');
  //@Input() events: DayPilot.EventData[] = [];

  events = input<DayPilot.EventData[]>([]);

  modeChanged = output<ModeChangedArgs>();
  datesSelected = output<{start: Date, end: Date}>();
  displayRangeChanged = output<{start: Date , end: Date, date: Date}>();
  eventClicked = output<any>();

  selectedDate = signal<DayPilot.Date>(DayPilot.Date.today());
  displayStart: DayPilot.Date;
  displayEnd: DayPilot.Date;

  constructor() {
    const localeKR = new DayPilot.Locale(
      'ko-kr',
      {
        dayNames:['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
        dayNamesShort:['일','월','화','수','목','금','토'],
        monthNames:['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월',''],
        monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월',''],
        timePattern:'h:mm tt',
        datePattern:'yyyy-M-d ddd',
        dateTimePattern:'yyyy-M-d h:mm tt',
        timeFormat:'Clock12Hours',
        weekStarts: 0                         // 0 일요일
      }
    );
    DayPilot.Locale.register(localeKR);

    this.selectedDate.set(DayPilot.Date.today());
    this.displayStart = this.selectedDate().firstDayOfMonth().firstDayOfWeek('ko-kr');
    this.displayEnd = this.selectedDate().lastDayOfMonth().addDays(7).firstDayOfWeek('ko-kr').addDays(-1);

    effect(() => {
      switch (this.mode()) {
        case "Day": this.viewDay(); break;
        case "Week": this.viewWeek(); break;
        case "Month": this.viewMonth(); break;
        default: this.viewMonth(); break;
      }
    })
  }

  configDay: DayPilot.CalendarConfig = {
    startDate: DayPilot.Date.today(),
    locale: 'ko-kr',
    heightSpec: 'BusinessHours',
    cellHeight: 41,
    onTimeRangeSelected: (params: DayPilot.CalendarTimeRangeSelectedArgs) => {
      this.selectedDate.set(params.start);
      this.datesSelected.emit({start: params.start.toDateLocal(), end: params.end.toDateLocal()});
    },
    onEventClicked: (params: DayPilot.CalendarEventClickedArgs) => {
      this.eventClicked.emit(params.e.data);
    }
  };

  configWeek: DayPilot.CalendarConfig = {
    startDate: DayPilot.Date.today(),
    viewType: "Week",
    locale: 'ko-kr',
    heightSpec: 'BusinessHours',
    cellHeight: 41,
    onTimeRangeSelected: (params: DayPilot.CalendarTimeRangeSelectedArgs) => {
      this.selectedDate.set(params.start);
      this.datesSelected.emit({start: params.start.toDateLocal(), end: params.end.toDateLocal()});
    },
    onEventClicked: (params: DayPilot.CalendarEventClickedArgs) => {
      this.eventClicked.emit(params.e.data);
    }
  };

  configMonth: DayPilot.MonthConfig = {
    startDate: DayPilot.Date.today(),
    locale: 'ko-kr',
    cellHeight: 150,
    onTimeRangeSelected: (params: DayPilot.MonthTimeRangeSelectedArgs) => {
      console.log(params);
      this.selectedDate.set(params.start);
      this.datesSelected.emit({start: params.start.toDateLocal(), end: params.end.toDateLocal()});
    },
    onEventClicked: (params: DayPilot.MonthEventClickedArgs) => {
      this.eventClicked.emit(params.e.data);
    }
  };

  ngAfterViewInit(): void {
    this.viewMonth();
    // this.loadTestEvents();
  }

  viewDay(): void {
    this.displayRangeChangedEvent(this.selectedDate());

    this.modeChanged.emit({mode: this.mode(), date: this.selectedDate()});
    /*
    this.configDay.visible = true;
    this.configWeek.visible = false;
    this.configMonth.visible = false;
    */
  }

  viewWeek(): void {
    this.displayRangeChangedEvent(this.selectedDate());

    this.modeChanged.emit({mode: this.mode(), date: this.selectedDate()});
    /*
    this.configDay.visible = false;
    this.configWeek.visible = true;
    this.configMonth.visible = false;
    */
  }

  viewMonth(): void {
    this.displayRangeChangedEvent(this.selectedDate());

    this.modeChanged.emit({mode: this.mode(), date: this.selectedDate()});
    /*
    this.configDay.visible = false;
    this.configWeek.visible = false;
    this.configMonth.visible = true;
    */
  }

  navigatePrevious(event: MouseEvent): void {
    event.preventDefault();
    if (this.mode() === 'Day') {
      this.selectedDate.set(this.selectedDate().addDays(-1));
      this.displayRangeChangedEvent(this.selectedDate());
    } else if (this.mode() === 'Week') {
      this.selectedDate.set(this.selectedDate().addDays(-7));
      this.displayRangeChangedEvent(this.selectedDate());
    } else if (this.mode() === 'Month') {
      this.selectedDate.set(this.selectedDate().addMonths(-1));
      this.displayRangeChangedEvent(this.selectedDate());
    }
  }

  navigateNext(event: MouseEvent): void {
    event.preventDefault();
    if (this.mode() === 'Day') {
      this.selectedDate.set(this.selectedDate().addDays(1));
      this.displayRangeChangedEvent(this.selectedDate());
    } else if (this.mode() === 'Week') {
      this.selectedDate.set(this.selectedDate().addDays(7));
      this.displayRangeChangedEvent(this.selectedDate());
    } else if (this.mode() === 'Month') {
      this.selectedDate.set(this.selectedDate().addMonths(1));
      this.displayRangeChangedEvent(this.selectedDate());
    }
  }

  navigateToday(event: MouseEvent): void {
    event.preventDefault();
    this.selectedDate.set(DayPilot.Date.today());
    this.displayRangeChangedEvent(this.selectedDate());
  }

  displayRangeChangedEvent(date: DayPilot.Date): void {
    if (this.mode() === 'Day') {
      this.displayStart = date;
      this.displayEnd = date;

      // Day Component
      this.configDay.startDate = this.displayStart;
      this.day().control.startDate = this.displayStart;

      const range = {start: date.toDateLocal(), end: date.toDateLocal(), date: this.selectedDate().toDateLocal()};
      this.displayRangeChanged.emit(range);
    } else if (this.mode() === 'Week') {
      const sunday: DayPilot.Date = this.selectedDate().firstDayOfWeek('ko-kr');
      this.displayStart = sunday;
      this.displayEnd = sunday.addDays(6);

      // Week Component
      this.week().control.startDate = this.displayStart;
      this.configWeek.startDate = this.displayStart;

      const range = {start: this.displayStart.toDateLocal(), end: this.displayEnd.toDateLocal(), date: this.selectedDate().toDateLocal()};
      this.displayRangeChanged.emit(range);
    } else if (this.mode() === 'Month') {

      this.selectedDate.set(this.selectedDate().firstDayOfMonth());
      this.displayStart = this.selectedDate().firstDayOfMonth().firstDayOfWeek('ko-kr');
      this.displayEnd = this.selectedDate().lastDayOfMonth().addDays(7).firstDayOfWeek('ko-kr').addDays(-1);

      /*
      console.log('selectedDate : ' + this.selectedDate());
      console.log('Month Start : ' + this.displayStart);
      console.log('Month End : ' + this.displayEnd);
      */

      // Month Component
      this.month().control.startDate = this.selectedDate().firstDayOfMonth();
      this.configMonth.startDate = this.selectedDate().firstDayOfMonth();

      const range = {start: this.displayStart.toDateLocal(), end: this.displayEnd.toDateLocal(), date: this.selectedDate().toDateLocal()};
      this.displayRangeChanged.emit(range);
    }
  }

  loadTestEvents(): void {
    /*
    this.events = [{
      id: 1,
      start: "2022-08-01T13:00:00",
      end: "2022-08-01T15:00:00",
      text: "Event 1",
      barColor: "#f1c232"
    },
    {
      id: 2,
      start: "2022-08-24T02:00:00.000Z",
      end: "2022-08-24T04:00:00.000Z",
      text: "Event 2"
    },
    {
      id: 3,
      start: '2022-08-05T20:40:04.665+09:00',
      end: '2022-08-05T20:40:04.665+09:00',
      text: 'ddd'
    }];
    */
  }

  async newEventModal(params: DayPilot.CalendarTimeRangeSelectedArgs | DayPilot.MonthTimeRangeSelectedArgs) {
    const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
    const dp = params.control;
    dp.clearSelection();
    if (!modal.result) { return; }
    dp.events.add(new DayPilot.Event({
      start: params.start,
      end: params.end,
      id: DayPilot.guid(),
      text: modal.result
    }));
  }

}

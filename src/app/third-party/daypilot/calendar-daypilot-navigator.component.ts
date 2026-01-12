import { Component, Input, output, viewChild } from '@angular/core';
import { DayPilotModule, DayPilot, DayPilotNavigatorComponent } from "@daypilot/daypilot-lite-angular";
import { OptionalSignal } from 'node_modules/@daypilot/daypilot-lite-angular/lib/util';


interface NavigatorTimeRangeSelectedArgs {
  readonly start: DayPilot.Date;
  readonly end: DayPilot.Date;
  readonly day: DayPilot.Date;
  readonly days: number;
  readonly mode: "Day" | "Week" | "Month" | "None" | "FreeHand";
}

interface NavigatorRangeChangedArgs {
  readonly start: DayPilot.Date;
  readonly end: DayPilot.Date;
  readonly date: DayPilot.Date;
}

@Component({
  selector: 'calendar-daypilot-navigator',
  imports: [
    DayPilotModule
  ],
  template: `
    <daypilot-navigator #navigator
      [config]="configNavigator"
      [events]="events"
      [(date)]="date">
   </daypilot-navigator>
  `,
  styles: `
  `
})
export class CalendarDaypilotNavigatorComponent {

  nav = viewChild.required<DayPilotNavigatorComponent>('navigator');

  @Input() mode: "Day" | "Week" | "Month" | "None" = "Day";
  //@Input() events: DayPilot.EventDataShort[] = [];
  @Input() events: OptionalSignal<DayPilot.EventData[]> = [];


  @Input() date: DayPilot.Date = DayPilot.Date.today();

  selectChanged = output<NavigatorTimeRangeSelectedArgs>();
  rangeChanged = output<NavigatorRangeChangedArgs>();

  configNavigator: DayPilot.NavigatorConfig = {
    orientation: 'Vertical',
    showMonths: 1,
    cellWidth: 28,
    cellHeight: 25,
    selectMode: this.mode,
    locale: 'ko-kr',
    onVisibleRangeChanged: (params: {start: DayPilot.Date , end: DayPilot.Date}) => {
      this.rangeChanged.emit({start: params.start, end: params.end, date: this.date });
    },
    onTimeRangeSelected: (params: NavigatorTimeRangeSelectedArgs) => {
      this.selectChanged.emit(params);
    }
  };

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

  }

  setMode(mode: "Day" | "Week" | "Month" | "None", date: DayPilot.Date): void {
    this.mode = mode;
    this.configNavigator.selectMode = this.mode;
    this.date = date;
  }

}

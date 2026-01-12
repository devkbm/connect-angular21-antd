import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzCalendarModule } from 'ng-zorro-antd/calendar';

@Component({
  selector: 'holiday-calendar',
  imports: [
    CommonModule,
    FormsModule,
    NzCalendarModule
  ],
  template: `
  <!--
   [nzDateFullCell]="dateCellTpl"
  -->
  <nz-calendar
    [nzDateCell]="dateCellTpl"
    [(ngModel)]="selectedDate"
    [(nzMode)]="mode"
  >
  <!--
    (nzPanelChange)="panelChange($event)"
    (nzSelectChange)="selectChange($event)"
  -->
    <!-- Another method for cell definition -->
    <div *nzDateCell>Foo</div>
  </nz-calendar>

  <!-- Passing TemplateRef -->
  <ng-template #dateCellTpl let-date>
    @for (d of dates; track $index) {
      @if (date.valueOf() === d.valueOf()) {
        O
        <!--<span>{{ date | date:'d'}}</span>-->
      } @else {
        X
        date : {{date | date}} - d : {{d | date}}
      }
    }
  </ng-template>
  `,
  styleUrls: []
})
export class HolidayCalendar {
  selectedDate: Date = new Date();
  mode: 'month' | 'year' = 'month';

  dates: Date[] = [new Date('2024-10-08 00:00:00')];

}

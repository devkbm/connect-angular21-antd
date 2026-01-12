import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface DutyDate {
  date: Date;
  isSelected: boolean;
  isHoliday: boolean;
  isSaturday: boolean;
  isSunday: boolean;
}


@Component({
  selector: 'duty-date-list',
  imports: [ CommonModule, FormsModule ],
  template: `
    {{this._data | json}}
    <div class="container">
      @for (item of _data; track item.date) {
        <label nz-checkbox [(ngModel)]="item.isSelected"> {{item.date | date: 'yyyy-MM-dd'}} </label>
      }
    </div>
  `,
  styles: [`
    .container {
      overflow: auto;
      background-color: green;
      height: 100px;
    }
  `]
})
export class DutyDateListComponent implements OnInit {

  _data: DutyDate[] = [{
    date: new Date(),
    isSelected: true,
    isHoliday: false,
    isSaturday: false,
    isSunday: false
  },{
    date: new Date(),
    isSelected: false,
    isHoliday: false,
    isSaturday: false,
    isSunday: false
  },{
    date: new Date(),
    isSelected: false,
    isHoliday: false,
    isSaturday: false,
    isSunday: false
  },{
    date: new Date(),
    isSelected: false,
    isHoliday: false,
    isSaturday: false,
    isSunday: false
  },{
    date: new Date(),
    isSelected: false,
    isHoliday: false,
    isSaturday: false,
    isSunday: false
  }

  ];

  ngOnInit() {
    this._data[0].isSelected
  }

  onChange(a: any) {

  }

}

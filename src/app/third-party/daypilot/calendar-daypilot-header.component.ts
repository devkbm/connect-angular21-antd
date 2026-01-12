import { CommonModule } from '@angular/common';
import { Component, input, model, output, signal } from '@angular/core';

@Component({
  selector: 'app-calendar-daypilot-header',
  imports: [ CommonModule ],
  template: `
  <div class="header">

    <div class="nav-buttons">
      <button (click)="navigatePrevious($event)" class="direction-button"><</button>
      <button (click)="navigateToday($event)">Today</button>
      <button (click)="navigateNext($event)" class="direction-button">></button>
    </div>

    <div class="title">
      @if (this.selectedMode() === 'Day') {
        {{titleStartDate() | date : 'YYYY-MM-dd' }}
      }

      @if (this.selectedMode() === 'Week') {
        {{titleStartDate() | date : 'YYYY-MM-dd' }} ~ {{titleEndDate() | date : 'YYYY-MM-dd' }}
      }

      @if (this.selectedMode() === 'Month') {
        {{titleStartDate() | date : 'YYYY-MM' }}
      }
    </div>

    <div class="view-buttons">
      <button (click)="viewDay()" [class]="this.selectedMode() === 'Day' ? 'selected' : ''">Day</button>
      <button (click)="viewWeek()" [class]="this.selectedMode() === 'Week' ? 'selected' : ''">Week</button>
      <button (click)="viewMonth()" [class]="this.selectedMode() === 'Month' ? 'selected' : ''">Month</button>
    </div>
  </div>
  `,
  styles: `
  .header {
    display: flex;
    flex-direction: row;
    align-content: stretch;
    justify-content: space-between;
  }

  .nav-buttons {
    margin-top: 10px;
    text-align: left;
    flex-basis: 300px;
  }

  .title {
    margin-top: 12px;
    font-size: 24px;
    text-align: center;
    vertical-align: middle;
    flex-basis: content;
  }

  .view-buttons {
    margin-top: 10px;
    text-align: right;
    flex-basis: 300px;
  }

  .direction-button {
    display: inline-block;
    outline: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    padding: 2px 16px;
    height: 38px;
    min-width: 48px;
    min-height: 38px;
    border: none;
    color: #fff;
    background-color: darkblue;
    transition: background-color .17s ease,color .17s ease;
  }

  button {
    display: inline-block;
    outline: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    padding: 2px 16px;
    height: 38px;
    min-width: 96px;
    min-height: 38px;
    border: none;
    color: #fff;
    background-color: darkblue;
    transition: background-color .17s ease,color .17s ease;
  }

  button:hover {
    background-color: rgb(71, 82, 196);
  }

  button.selected {
    background-color: #1c4587;
  }
  `
})
export class CalendarDaypilotHeaderComponent  {

  selectedMode = model<"Day" | "Week" | "Month">("Month");

  titleStartDate = input<Date>(new Date());
  titleEndDate = input<Date>(new Date());

  previousButtonClicked = output<any>();
  todayButtonClicked = output<any>();
  nextButtonClicked = output<any>();

  constructor() { }

  viewDay() {
    this.selectedMode.set("Day");
  }

  viewWeek() {
    this.selectedMode.set("Week");
  }

  viewMonth() {
    this.selectedMode.set("Month");
  }

  navigatePrevious(event: MouseEvent): void {
    event.preventDefault();

    this.previousButtonClicked.emit(event);
  }

  navigateNext(event: MouseEvent): void {
    event.preventDefault();

    this.nextButtonClicked.emit(event);
  }

  navigateToday(event: MouseEvent): void {
    event.preventDefault();

    this.todayButtonClicked.emit(event);
  }
}

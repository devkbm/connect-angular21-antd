import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'nz-search-area',
  imports: [CommonModule],
  template: `
    <div class="search-area" [style.height]="height()">
      <!--{{height() | json}}-->
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .search-area {
      overflow: auto;
      //background-color: green;

      padding: 6px;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      padding-left: auto;
      padding-right: 5;
    }
  `]
})
export class NzSearchArea {
  height = input<any>('46px');

}

import { Component, OnInit, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule, NzCheckboxOption } from 'ng-zorro-antd/checkbox';

import { ResponseList } from 'src/app/core/model/response-list';
import { NotifyService } from 'src/app/core/service/notify.service';

import { getHttpOptions } from 'src/app/core/http/http-utils';
import { GlobalProperty } from 'src/app/core/global-property';

@Component({
  selector: 'my-work-calendar-list',
  imports: [ CommonModule, NzGridModule, FormsModule, NzCheckboxModule, NzIconModule ],
  template: `
    <!--
    <div>
      {{value | json}}
    </div>
    -->
    <nz-checkbox-group [(ngModel)]="value" (ngModelChange)="selectionChanged($event)">
      @for (item of workGroupList(); track item) {
        <nz-row [nzGutter]="4">
          <nz-col>
            <div class="color-box" [style.background-color]="item.color">&nbsp;</div>
          </nz-col>
          <nz-col>
            <label nz-checkbox [nzValue]="item.id">{{item.name}}</label>
            <nz-icon nzType="edit" nzTheme="outline" (click)="rowDbClicked(item.id)" />
          </nz-col>
        </nz-row>
      }
    </nz-checkbox-group>
  `,
  styles: [`
    .color-box {
      border: 1px solid rgba(56, 56, 56, 0.77);
      width: 20px;
    }
  `]
})
export class MyWorkCalendarList implements OnInit {

  workGroupList = signal<any[]>([]);

  value: Array<string | number> = [];
  options: NzCheckboxOption[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();

  private notifyService = inject(NotifyService);
  private http = inject(HttpClient);

  ngOnInit() {
    this.getMyWorkGroupList();
  }

  getMyWorkGroupList(): void {
    const url =  GlobalProperty.serverUrl() + `/api/grw/myworkcalendar`;
    const options = getHttpOptions();

    this.http.get<ResponseList<any>>(url, options).pipe(
            //catchError(this.handleError<ResponseList<WorkCalendar>>('getWorkGroupList', undefined))
        )
        .subscribe(
          (model: ResponseList<any>) => {
            this.workGroupList.set(model.data);

            for (const opt of this.workGroupList()) {
              this.options.push({label: opt.name!, value: opt.id!})
            }
          }
        )
  }

  selectionChanged(event: any): void {
    this.rowClicked.emit(event);
  }

  rowDbClicked(event: any): void {
    this.rowDoubleClicked.emit(event);
  }
}

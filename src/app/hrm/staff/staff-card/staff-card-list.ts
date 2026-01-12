import { CommonModule } from '@angular/common';
import { StaffCard } from './staff-card';

import { Component, OnInit, inject } from '@angular/core';
import { ResponseList } from 'src/app/core/model/response-list';
import { StaffCardService } from './staff-card.service';

export interface StaffCardModel {
  staffId: string | null;
  staffNo: string | null;
  staffName: string | null;
  profilePicture: string | null;
  extensionNumber: string | null;
  mobileNumber: string | null;
  blngDeptName: string | null;
  workDeptName: string | null;
  jobPositionName: string | null;
}


@Component({
  selector: 'staff-card-list',
  imports: [
    CommonModule, StaffCard
  ],
  template: `
    @for (item of _list; track item.staffId) {
      <staff-card [data]="item"></staff-card>
    }
  `,
  styles: []
})
export class StaffCardList implements OnInit {
  _list: StaffCardModel[] = [];

  private service = inject(StaffCardService);

  ngOnInit() {
    this.getStaffCardList();
  }

  getStaffCardList() {
    this.service
        .getList()
        .subscribe(
          (model: ResponseList<StaffCardModel>) => {
            this._list = model.data;
          }
        );
  }
}

import { Component, OnInit, inject, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

import { RoadAddress, RoadAddressJuso, RoadAddressResult } from './road-address.model';
import { RoadAddressService } from './road-address.service';
import { NzSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'app-nz-list-road-address',
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzListModule,
    NzPaginationModule,
    NzSpaceModule
  ],
  providers: [NzMessageService],
  template: `
    111- {{searchText()}}
    <div class="container" [style.height]="height()">
      <nz-space-compact nzBlock>
        <nz-input-search>
          <input nz-input type="text" [(ngModel)]="searchText" (keyup.enter)="fetch()" placeholder="input search text"/>
        </nz-input-search>
        <button nz-button nzType="primary" nzSearch on-click="fetch()"><span nz-icon nzType="search"></span></button>
      </nz-space-compact>

      <nz-list [nzLoading]="_isLoading">
        @for (item of _data?.juso; track item.roadAddr) {
        <nz-list-item (click)="choice(item)">
          <span nz-typography> {{ item.roadAddr }} </span>
          {{ item.zipNo }}
        </nz-list-item>
        }
      </nz-list>
      <nz-pagination [nzPageIndex]="_page?.index" [nzPageSize]="countPerPage()" [nzTotal]="_page?.total" (nzPageIndexChange)="changePageIndex($event)"></nz-pagination>
    </div>
  `,
  styles: [`
    span:hover {
      text-decoration: underline;
    }

    .container {
      overflow: auto;
    }
  `]
})
export class NzListRoadAddressComponent implements OnInit {

  searchText = model('');
  height = input<string>('100%');
  countPerPage = input<number>(10);

  itemClicked = output<{roadAddress: string, zipNo: string}>();

  protected _isLoading: boolean = false;
  protected _data?: RoadAddress;
  protected _page?: {index: number, total: number};

  private service = inject(RoadAddressService);
  private message = inject(NzMessageService);

  ngOnInit() {
  }

  choice(item: RoadAddressJuso) {
    this.itemClicked.emit({roadAddress: item.roadAddr, zipNo: item.zipNo});
  }

  changePageIndex(page: number) {
    if (this._page) {
      this._page.index = page;
    } else {
      this._page = {index: page, total: 0};
    }
    this.fetch();
  }

  fetch() {
    let currentPage: number = this._page?.index ?? 1;
    this.getList(this.searchText(), currentPage, this.countPerPage());
  }

  getList(keyword: string, currentPage: number, countPerPage: number) {
    if (!keyword) {
      this.message.create('warning', `검색어를 입력해주세요.`);
      return;
    }

    this._isLoading = true;
    this.service
        .get(keyword, currentPage, countPerPage)
        .subscribe(
          (model: RoadAddressResult) => {
            this._data = model.results;
            this._page = {index: this._data.common.currentPage, total: parseInt(this._data.common.totalCount) };
            this._isLoading = false;
          }
        );
  }

}

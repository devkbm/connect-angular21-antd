import { Component, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { NzListModule } from 'ng-zorro-antd/list';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { ResponseSpringslice } from 'src/app/core/model/response-springslice';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

import { PostListRow } from './post-list-row';

// 무한 스크롤 적용 필요
// https://www.npmjs.com/package/ngx-infinite-scroll

export interface PostListData {
  boardId: string;
  postId: string;
  writerId: string;
  writerName: string;
  writerImage: string;
  title: string;
  hitCount: number;
  editable: boolean;
  isAttachedFile: boolean;
  fileCount: number;
  isRead: boolean;
}

@Component({
  selector: 'post-list',
  imports: [
    CommonModule,
    NzListModule,
    NzButtonModule,
    InfiniteScrollDirective,
    PostListRow
  ],
  template: `
    <!-- [style.background-color]="'grey'" -->
    <div
      [style.height]="height()"
      [style.overflow]="'auto'"
      infiniteScroll
      [infiniteScrollDistance]="2"
      [infiniteScrollThrottle]="275"
      [infiniteScrollUpDistance]="1"
      [alwaysCallback]="true"
      [scrollWindow]="false"
      (scrolled)="onScroll($event)"
      (scrolledUp)="onScrollUp($event)"
    >
      <!--{{this.pageable | json}}-->
      @for (post of posts(); track post.postId; let idx = $index) {
        <post-list-row
          [post]="post"
          (viewClicked)="onViewClicked(post)"
          (editClicked)="onEditClicked(post)">
        </post-list-row>

        @if (idx < posts.length - 1) {
          <hr class="hr-line">
        }
      }
    </div>
  `,
  styles: `
    .hr-line {
      border-width:1px 0 0 0; border-color:#818181;
    }
  `
})
export class PostList {

  private http = inject(HttpClient);

  posts = signal<PostListData[]>([]);

  boardId = input<string>();
  height = signal<string>('calc(100vh - 154px)');

  editClicked = output<PostListData>();
  viewClicked = output<PostListData>();

  pageable: {page: number, isLast: boolean} = {page: 0, isLast: false};

  constructor() {
    effect(() => {
      if (this.boardId()) {
        this.getList(this.boardId());
      }
    })
  }

  getList(boardId: any, page: number = 0, size: number = 20): void {
    let url = GlobalProperty.serverUrl() + `/api/grw/board/post_slice?boardId=${boardId}`;
    const options = getHttpOptions();

    url = url + '&page='+ page + '&size='+ size;

    this.http
        .get<ResponseSpringslice<PostListData>>(url, options).pipe(
        //  catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseSpringslice<PostListData>) => {

            if (model.numberOfElements > 0) {
              if (model.first) this.posts.set([]);

              this.posts().push(...model.content);
              this.pageable ={page: model.number, isLast: model.last};
            } else {
              this.posts.set([]);
            }
            //this.notifyService.changeMessage(model.message);
          }
        );
  }

  onEditClicked(post: any) {
    this.editClicked.emit(post);
  }

  onViewClicked(post: any) {
    this.viewClicked.emit(post);
  }

  onScroll(ev: any) {
    console.log("scrolled!");
    //console.log(ev);

    if (!this.pageable.isLast) {
      this.getList(this.boardId(), this.pageable.page + 1);
    }
  }

  onScrollUp(ev: any) {
    console.log("scrolled Up!");
    //console.log(ev);
  }
}

import { Component, computed, input, output } from '@angular/core';

import { GlobalProperty } from 'src/app/core/global-property';

import { PostListData } from './post-list';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';


@Component({
  selector: 'post-list-row',
  imports: [
    NzAvatarModule,
    NzButtonModule,
    NzIconModule
  ],
  template: `
  <div>
    <nz-avatar class="avatar" nzShape="square" [nzSize]='24' [nzSrc]="imageSrc()"/>

    {{post()?.writerName}} · <span nz-icon nzType="eye" nzTheme="outline"></span> {{post()?.hitCount}}

    @if (post()?.fileCount ?? false) {
      · <span nz-icon nzType="file" nzTheme="outline"></span> {{post()?.fileCount}}
    }

    <br/>
    <!--
    {{article()?.isRead}} -
    {{article()?.articleId}} -
    -->
    <a [class.text-bold]="!post()?.isRead" (click)="onViewClicked(post)">{{post()?.title}}</a> &nbsp;

    @if (post()?.editable) {
      <button nz-button nzShape="circle" (click)="onEditClicked(post)"><span nz-icon nzType="edit" nzTheme="outline"></span></button>
    }
  </div>
  `,
  styles: `
  :host {
    display: inline
  }

  .text-bold {
    font-weight: bold;
  }

  a {
    color: Silver;
  }

  a:hover {
    color: LightSlateGray;
    text-decoration: underline;
  }
  `
})
export class PostListRow {

  post = input<PostListData>();

  imageSrc = computed(() => {
    if (this.post()?.writerImage) {

      let urlParams = new URLSearchParams();
      urlParams.set("companyCode", sessionStorage.getItem("companyCode")!);
      urlParams.set("userId", this.post()?.writerId!);

      return GlobalProperty.serverUrl() + '/api/system/user/image' + '?' + urlParams; //+ this.post()?.writerImage;
    } else {
      return undefined;
    }
  });

  viewClicked = output<PostListData>();
  editClicked = output<PostListData>();

  onViewClicked(post: any) {
    this.viewClicked.emit(post);
  }

  onEditClicked(post: any) {
    this.editClicked.emit(post);
  }

}

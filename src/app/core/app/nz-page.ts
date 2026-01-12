import { ChangeDetectionStrategy, Component, input, TemplateRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ng-page',
  imports: [
    CommonModule
  ],
  template: `
    @if (header().template) {
      <!--[ngStyle]="{'height': header().height}" -->
      <div [style.height]="header().height" >
        <ng-container [ngTemplateOutlet]="header().template"></ng-container>
      </div>
    }

    @if (search().template) {
      <div [style.height]="search().height">
        <ng-container [ngTemplateOutlet]="search().template"></ng-container>
      </div>
    }

    <div class="body">
      <ng-content></ng-content>
    </div>

    @if (footer().template) {
      <div [style.height]="footer().height">
        <ng-container [ngTemplateOutlet]="footer().template"></ng-container>
      </div>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .body {
      flex: 1;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgPage implements AfterViewInit {

  header = input<{template: TemplateRef<{}> | null, height: string | null}>({
    template: null, height: '0px'
  });

  search = input<{template: TemplateRef<{}> | null, height: string | null}>({
    template: null, height: '0px'
  });

  footer = input<{template: TemplateRef<{}> | null, height: string | null}>({
    template: null, height: '0px'
  });

  //private hostElement = inject(ElementRef);

  constructor() {}

  ngAfterViewInit(): void {
    //console.log(this.hostElement.nativeElement);
    //console.log(this.hostElement.nativeElement.offsetHeight);
  }
}

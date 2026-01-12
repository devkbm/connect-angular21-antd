import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, inject, Input, PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[kAutoFocus]'
})
export class AutoFocusDirective {

  @Input('kAutoFocus') _autofocus = false;

  focused: boolean = false;

  platformId = inject(PLATFORM_ID);

  document: Document = inject(DOCUMENT);

  host: ElementRef = inject(ElementRef);

  ngAfterContentChecked() {
    // This sets the `attr.autofocus` which is different than the Input `autofocus` attribute.
    if (this._autofocus === false) {
        this.host.nativeElement.removeAttribute('autofocus');
    } else {
        this.host.nativeElement.setAttribute('autofocus', true);
    }

    if (!this.focused) {
        this.autoFocus();
    }
  }

  ngAfterViewChecked() {
    if (!this.focused) {
        this.autoFocus();
    }
  }

  autoFocus() {
    if (isPlatformBrowser(this.platformId) && this._autofocus) {
      setTimeout(() => {

          this.host.nativeElement.focus();

          this.focused = true;
      });
    }
  }

}

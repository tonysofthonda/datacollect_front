import {
  Component,
  ElementRef,
  AfterViewInit,
  Input,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
})
export class CodeComponent implements AfterViewInit {
  @Input() lang = 'markup';

  @ViewChild('code') codeViewChild!: ElementRef;

  constructor(public el: ElementRef) {}

  ngAfterViewInit() {
    if ((window as any)['Prism']) {
      (window as any)['Prism'].highlightElement(
        this.codeViewChild.nativeElement
      );
    }
  }
}

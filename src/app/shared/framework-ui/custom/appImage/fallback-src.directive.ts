import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFallbackSrc]'
})
export class FallbackSrcDirective {
  
  constructor(private el: ElementRef) { }

  @HostListener('error') onError() {
    this.el.nativeElement.src = '../../../../assets/images/imgDefault.png'
  }
}

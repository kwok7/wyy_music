import { Directive, ElementRef, HostBinding, Input, Renderer2, SimpleChange, SimpleChanges } from '@angular/core';
import { IconType } from './type';

@Directive({
  selector: 'i[xmIcon]'
})
export class IconDirective {

  @HostBinding('class.iconfont') hostCls = true;
  @Input('xmIcon') type?: IconType;
  constructor(
    private elementRef: ElementRef,
    private rd2: Renderer2
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    const { type } = changes;
    
    if (changes['type'].previousValue) {
      this.rd2.removeClass(this.elementRef.nativeElement, 'icon' + type.previousValue)
    }
    this.rd2.addClass(this.elementRef.nativeElement, 'icon-' + type.currentValue)
  }

}

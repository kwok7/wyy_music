import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import {displayType} from '../rate.component'

const rateItemClassName='xm-rate-item'

@Component({
  selector: 'xm-rate-item',
  templateUrl: './rate-item.component.html',
  styleUrls: ['./rate-item.component.scss']
})
export class RateItemComponent {
  @Input() index = 0;

  @Output() private itemHover = new EventEmitter<boolean>();
  @Output() private itemClick = new EventEmitter<boolean>();

  constructor(
    private el: ElementRef,
    private rd2:Renderer2
  ) {

  }

  clickRate(isHalf: boolean) {
    this.itemClick.emit(isHalf)
  }

  hoverRate(isHalf: boolean) {
    this.itemHover.emit(isHalf)
  }

  highlight(classSuffix:displayType) {
    const ele = this.el.nativeElement.querySelector('div.xm-rate-item')
    this.rd2.addClass(ele,`${rateItemClassName}-${classSuffix}`)
  }

  removeHightlight(){
    const ele = this.el.nativeElement.querySelector('div.xm-rate-item')
    this.rd2.removeClass(ele,`${rateItemClassName}-full`)
    this.rd2.removeClass(ele,`${rateItemClassName}-half`)
  }
}

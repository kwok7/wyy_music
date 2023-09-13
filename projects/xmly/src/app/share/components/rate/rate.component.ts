import { Component, ElementRef, Input, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { RateItemComponent } from './rate-item/rate-item.component';

export type displayType = 'full' | 'half'

@Component({
  selector: 'xm-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent {

  @Input() count = 5;
  @ViewChildren(RateItemComponent) rateItems?: QueryList<RateItemComponent>
  starArray: number[] = [];
  private hoverValue = 0;
  private actualValue = 0;


  constructor(
    private el: ElementRef,
    private rd2: Renderer2
  ) { }

  ngOnInit(): void {
    this.updateStarArray();
  }

  private updateStarArray(): void {
    //Array(5)
    this.starArray = Array(this.count).fill(0).map((item, index) => index);

  }

  handleItemClick(ev: boolean, index: number) {
    if (this.rateItems) {
      this.clearHighlights();
      if (index === 0) {
        //half star
        if (ev === true) {
          this.highlightHalfStar(0);
        } else {
          this.highlightFullStars(0)
        }

      } else {
        if (ev === true) {
          this.highlightFullStars(index - 1);
          this.highlightHalfStar(index)
        } else {
          this.highlightFullStars(index)
        }
      }
    }
  }

  highlightFullStars(endIndex: number): void {
    this.rateItems!.forEach(c => {
      if (c.index <= endIndex) {
        c.highlight('full')
      }
    })
  }

  highlightHalfStar(index: number): void {
    this.rateItems?.forEach(c => {
      c.index === index ? c.highlight('half') : null
    })
  }

  clearHighlights() {
    this.rateItems?.forEach(c => {
      c.removeHightlight();
    })
  }

  handleItemHover(ev: boolean, index: number) {
  }
}

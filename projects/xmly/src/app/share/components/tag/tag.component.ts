import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, Renderer2, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
const ColorPresets = ['magenta', 'orange', 'green'];
type TagMode = 'default' | 'circle';
@Component({
  selector: 'xm-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TagComponent implements OnInit {
  @HostBinding('class.xm-tag') readonly hostCls = true;
  @HostBinding('class.xm-tag-circle')
  get circleCls(): boolean {
    return this.xmShape === 'circle'
  }
  @HostBinding('class.xm-tag-close')
  get closeCls():boolean{
    return this.xmClosable === true
  }

  @Input() xmColor = '';
  @Input() xmShape: TagMode = 'default';
  @Input() xmClosable = false;
  @Output() closed = new EventEmitter<void>();

  constructor(private el: ElementRef, private rd2: Renderer2) { }

  ngOnInit(): void {

  }
  // ngAfterViewInit(): void {
  //   this.setStyle()
  // }

  setStyle() {
    if (!this.el.nativeElement || !this.xmColor) { return }
    if (ColorPresets.includes(this.xmColor)) {
      this.rd2.addClass(this.el.nativeElement, 'xm-tag-' + this.xmColor)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (!this.el.nativeElement || !this.xmColor) { return }
    console.log(changes['xmColor']);

    if (ColorPresets.includes((changes['xmColor'].previousValue))) {
      this.rd2.removeClass(this.el.nativeElement, 'xm-tag-' + changes['xmColor'].previousValue)
    }
    if (ColorPresets.includes(this.xmColor)) {
      this.rd2.addClass(this.el.nativeElement, 'xm-tag-' + this.xmColor)
    }else{
      this.rd2.setStyle(this.el.nativeElement,'color','#fff')
      this.rd2.setStyle(this.el.nativeElement,'border-color','transparent')
      this.rd2.setStyle(this.el.nativeElement,'background-color',changes['xmColor'])
    }
  }


}

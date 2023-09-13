import { Directive, ViewContainerRef, TemplateRef, Input, SimpleChanges, OnChanges } from '@angular/core';

@Directive({
  selector: '[xmStrTplOutlet]'
})
export class StrTplOutletDirective implements OnChanges {
  @Input() xmStrTplOutlet?: TemplateRef<any> | string
  constructor(
    private viewContainer: ViewContainerRef,
    private TemplateRef: TemplateRef<any>

  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    const {xmStrTplOutlet} = changes;
    if(xmStrTplOutlet){
      this.viewContainer.clear();
      const template = (this.xmStrTplOutlet instanceof TemplateRef)?this.xmStrTplOutlet:this.TemplateRef;
      this.viewContainer.createEmbeddedView(template)
    }
  }
}
 
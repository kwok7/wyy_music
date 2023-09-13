import { Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'xm-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class BreadcrumbComponent {
  @Input() xmSeparator?:TemplateRef<any>|string;
}

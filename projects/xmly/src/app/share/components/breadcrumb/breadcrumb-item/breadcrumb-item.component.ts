import { ChangeDetectionStrategy, Component, Input, Optional, TemplateRef } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb.component';

@Component({
  selector: 'xm-breadcrumb-item',
  templateUrl: './breadcrumb-item.component.html',
  styleUrls: ['./breadcrumb-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbItemComponent {
  parent:BreadcrumbComponent;
  isTempalte:boolean=false;
  constructor(
    @Optional() parent:BreadcrumbComponent
  ){this.parent = parent;}
}

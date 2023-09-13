import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrTplOutletDirective } from './str-tpl-outlet.directive';
import { IconDirective } from './icon/icon.directive';
import { XmBtnDirective } from './xm-btn.directive';
import { ToggleMoreDirective } from './toggle-more.directive';



@NgModule({
  declarations: [
    StrTplOutletDirective,
    IconDirective,
    XmBtnDirective,
    ToggleMoreDirective,
  ],
  imports: [
    CommonModule
  ],
  exports:[
    StrTplOutletDirective,
    IconDirective,
    XmBtnDirective,
    ToggleMoreDirective
  ]
})
export class DirectivesModule { }

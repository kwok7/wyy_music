import { clamp } from 'lodash';
import { FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, forwardRef } from '@angular/core';
import { CheckboxComponent } from './checkbox.component';

export type CheckBoxValue = number | string;

@Component({
  selector: 'xm-checkbox-group',
  template: `
  <div class="xm-checkbox-group">
   <ng-content></ng-content>
  </div>
  `,
  styles: [
    `
    .xm-checkbox-group{
      display:inline-block;
    }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi: true
    }
  ]
})
export class CheckboxGroupComponent implements ControlValueAccessor {

  constructor(
    private cdr: ChangeDetectorRef
  ) {

  }

  //存储选中项
  private current: CheckBoxValue[] = [];
  private checkboxes: CheckboxComponent[] = [];

  // @Input() set initCurrent(checks: CheckBoxValue[]) {
  //   this.current = checks
  //   if(checks.length){
  //     setTimeout(() => {
  //       this.updateCheckBox(checks)
  //     }, 0);
  //   }
  // }

  updateCheckBox(current: CheckBoxValue[]) {
    if (this.checkboxes.length) {
      this.checkboxes.forEach(item => {
        item.writeValue(current.includes(item.value))
      })
    }
  }

  addCheckBox(checkBox: CheckboxComponent): void {
    this.checkboxes.push(checkBox)
    console.log('checkbox', checkBox); 
  }

  private onChange = (value: CheckBoxValue[]) => { }
  private onTouched = () => { }
  writeValue(value: CheckBoxValue[]): void { 
    this.current = value
    if (value?.length) {
      this.updateCheckBox(value)
    }
    this.cdr.markForCheck();
  }
  registerOnChange(fn: (value: CheckBoxValue[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

}

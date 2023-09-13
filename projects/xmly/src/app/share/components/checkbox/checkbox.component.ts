import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, HostListener, Input, Optional, Output, ViewEncapsulation } from '@angular/core';
import { CheckBoxValue, CheckboxGroupComponent } from './checkbox-group.component';


export type checkStatus ='remove'|'add'
@Component({
  selector: '[xm-checkbox]',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true
  }],
  host: {
    '[class.xm-checkbox-wrap]': 'true'
  },
  encapsulation: ViewEncapsulation.None

})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() value!: CheckBoxValue;
  @Output() toggleCheckEv = new EventEmitter<checkStatus>()

  @HostBinding('class.checked') checked = true;
  @HostBinding('class.disabled') disabled = false;
  @HostListener('click', ['$event']) toggleCheck() {
    event?.preventDefault();
    if (!this.disabled) {
      this.checked = !this.checked;
      this.onChange(this.checked)
      if(this.checked){
        this.toggleCheckEv.emit('add')
      }else{
        this.toggleCheckEv.emit('remove')
      }
    }
  }



  constructor(
    private cdr: ChangeDetectorRef,
    @Optional() private parent: CheckboxGroupComponent
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // if (parent) {
    //   this.parent.addCheckBox(this)
    // }

  }

  private onChange = (value: boolean) => { }
  private onTouched = () => { }



  writeValue(checked: boolean): void {
    this.checked = checked;
    this.cdr.markForCheck();
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(disabled: boolean): void {
    this.disabled = disabled;
  }

}

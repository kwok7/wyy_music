import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'xm-sizer',
  templateUrl: './sizer.component.html',
  styleUrls: ['./sizer.component.scss'],
  providers:[
    {
      provide:NG_VALUE_ACCESSOR,
      useExisting:forwardRef(()=>SizerComponent),
      multi:true
    }
  ]
})
export class SizerComponent implements ControlValueAccessor {
  //@Input() size=0;;
  // @Output() sizeChange = new EventEmitter<number>();

  size = 16;

  inc() {
    //this.size++
    // this.sizeChange.emit(this.size)
    this.size+=1;
    this.onChange(this.size)
  }

  dec() {
    //this.size--
    // this.sizeChange.emit(this.size)
    this.size-=1;
    this.onChange(this.size)
  }

  private onChange = (value:number)=>{}
  private onTouched = ()=>{};
  //set value
  writeValue(value: number): void {
    console.log('write value', value);
    this.size = value;
  }
  registerOnChange(fn: (value:number)=>void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: ()=>void): void {
    this.onTouched = fn;
  }
  //optional
  // setDisabledState?(isDisabled: boolean): void {
  //   throw new Error('Method not implemented.');
  // }
}

import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, ElementRef, OnInit, AfterViewInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Route } from '@angular/router';
@Component({
  selector: 'xm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('moveUpMotion', [
      state('1', style({
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1
      })),
      transition('* => 1', [
        style({
          transform: 'translateY(-100%)',
          opacity: 0
        }),
        animate('300ms ease-out')
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  user: any;
  fix = true;

  @Output() loginEv = new EventEmitter<void>();

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
  ) { }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    fromEvent(this.doc, 'scroll').
      pipe(debounceTime(300), distinctUntilChanged()).
      subscribe(() => {
        const top = this.doc.documentElement.scrollTop;
        // console.log('top', top) ;
        console.log('top', this.el.nativeElement.clientHeight);
        if (top > this.el.nativeElement.clientHeight + 100) {
          this.fix = true;

        } else if (top === 0) {
          this.fix = false;
        }
        this.cdr.markForCheck()
      })
  }
}


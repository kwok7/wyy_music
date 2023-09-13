import { FormBuilder, Validators, FormControl, ValidationErrors, AbstractControl } from '@angular/forms';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, Renderer2, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { pluck, switchMap, of, empty, Subscription } from 'rxjs';
import { OverlayRef, OverlayService } from '../../services/tools/overlay.service';
import { merge } from 'lodash';
import { isPlatformBrowser } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { UserService } from '../../services/apis/user.service';
import { stringify } from 'qs';
import { WindowService } from '../../services/tools/window.service';

const phone = '13647008979';
const password = 'angular10';

@Component({
  selector: 'xm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('modalAni', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(100%)'
        }),
        animate('.2s', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ]),
      transition(':leave', [
        animate('.3s', style({
          opacity: 0,
          transform: 'translateY(-100%)'
        }))
      ])
    ])
  ]
})
export class LoginComponent implements AfterViewInit, OnChanges {

  @Input() show = false;
  @Output() hide = new EventEmitter<void>();
  private overlayRef?: OverlayRef | null;
  private overlaySub?: Subscription | null;
  remember = true;
  formValues = this.fb.group({
    phone: [phone, [
      Validators.required,
      Validators.pattern(/^1\d{10}$/)]
    ],
    password: [password, [
      Validators.required,
      Validators.minLength(6)
    ]]
  })

  @ViewChild('modalWrap', { static: false }) private modalWrap?: ElementRef
  constructor(
    private overlayService: OverlayService,
    private el: ElementRef,
    private rd2: Renderer2,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: object,
    private userService: UserService,
    private windowService: WindowService
  ) {
  }
  ngAfterViewInit(): void {
    //this.showOverlay()
  }


  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['show'].currentValue) {
      this.create()
    } else if (changes['show'].currentValue === false) {
      this.dispose();
    }
  }

  create() {
    if (isPlatformBrowser(this.platformId)) {
      this.overlayRef = this.overlayService.create({ fade: true, center: true, bakckgroundColor: 'rgba(0,0,0,.32)' });
      console.log('overlayref', this.overlayRef);
      this.overlaySub = merge(
        this.overlayRef?.backdropClick(),
        this.overlayRef?.backdropKeyup().pipe(
          pluck('key'),
          switchMap(key => {
            return key.toUpperCase() === 'ESCAPE' ? of(key) : empty();
          })
        )
      )?.subscribe(() => {
        console.log('listen event');
        // this.hideOverlay();
        this.hide.emit();
      })

      setTimeout(() => {
        // console.log(this.overlayRef?.container);

        this.rd2.appendChild(this.overlayRef?.container, this.modalWrap?.nativeElement)
      }, 0);
    }
  }

  get formControls(): { [key: string]: { control: AbstractControl, showErr?: boolean, errors?: ValidationErrors | null } } | undefined {
    const controls = {
      phone: this.formValues.get('phone'),
      password: this.formValues.get('password')
    }
    if (controls) {
      return {
        'phone': {
          control: controls.phone!,
          showErr: controls.phone!.touched && controls.phone!.invalid,
          errors: controls.phone!.errors || []
        },
        password: {
          control: controls.password!,
          showErr: controls.password!.touched && controls.password!.invalid,
          errors: controls.password!.errors || []
        }
      }
    } else return;
  }

  dispose(): void {
    if (this.overlaySub) {
      this.overlaySub.unsubscribe();
      this.overlaySub = null;
    }
    if (this.overlayRef) {
      this.overlayRef?.dispose();
      this.overlayRef = null;
    }
  }

  submit() {
    console.log('submit', this.formValues.value);
    if (this.formValues.valid) {
      this.userService.login(this.formValues.value).subscribe(({ user, token }) => {
        // console.log('login' + stringify({user,token}))
        alert('登陆成功!')
        this.windowService.setStorage('xm-auth', token)
        if (this.remember) {
          this.windowService.setStorage('remember', 'true')
        }
      }, error => {
        console.log(error);
        alert(error.error.message || '登陆失败')  
      }
      )

    }

  }
}

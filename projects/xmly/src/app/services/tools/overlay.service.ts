import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable, Subject, from, fromEvent, merge, takeUntil } from 'rxjs';

export interface OverlayRef {
  container: HTMLElement,
  backdropClick: () => Observable<MouseEvent>,
  backdropKeyup: () => Observable<KeyboardEvent>,
  dispose: () => void
}

export interface OverlayConfig {
  center?: boolean;
  fade?: boolean;
  bakckgroundColor?: string,
  responseEvent?:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  private rd2: Renderer2;
  readonly defaultConfig: Required<OverlayConfig> = {
    center: false,
    fade: false,
    bakckgroundColor: '',
    responseEvent:true
  };
  private config!: Required<OverlayConfig>;

  private backdropElement!: HTMLElement;

  private detachment$ = new Subject<void>()
  private backdropClicck$ = new Subject<MouseEvent>()
  private backdropKeyup$ = new Subject<KeyboardEvent>();

  private overlayRef?: OverlayRef | null;

  constructor(
    private rdFactory2: RendererFactory2,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.rd2 = rdFactory2.createRenderer(null, null)
  }

  create(config?: OverlayConfig): OverlayRef | undefined {
    if (isPlatformBrowser(this.platformId)) {
      this.config = { ...this.defaultConfig, ...config };
      const container = this.rd2.createElement('div');
      this.rd2.addClass(container, 'overlay-container');
      container.innerHTML = '<div class="overlay-mask"></div>';
      this.rd2.appendChild(this.doc.body, container);
      this.backdropElement = container.querySelector('.overlay-mask');
      this.setConfigs(container);
      this.overlayRef = {
        container,
        backdropClick: this.backdropClick.bind(this),
        backdropKeyup: this.backdropKeyup.bind(this),
        dispose: this.dispose.bind(this)
      }
      return this.overlayRef;
    } else return;
  }

  backdropClick(): Observable<MouseEvent> {
    console.log('this', this);

    return this.backdropClicck$.asObservable();
  }

  backdropKeyup(): Observable<KeyboardEvent> {
    console.log('keyboard ev');

    return this.backdropKeyup$.asObservable();
  }

  private setConfigs(container: HTMLElement): void {
    const { center, fade, bakckgroundColor,responseEvent } = this.config;
    if (center) {
      this.rd2.addClass(container, 'overlay-center')
    }
    if (fade) {
      setTimeout(() => {
        this.rd2.addClass(this.backdropElement, 'overlay-mask-show')
      }, 0);
    } else {
      this.rd2.addClass(this.backdropElement, 'overlay-mask-show')
    }
    if (bakckgroundColor) {
      this.rd2.setStyle(this.backdropElement, 'background-color', bakckgroundColor)
    }
    if(responseEvent){
      this.rd2.setStyle(this.backdropElement,'pointer-events', 'auto')
      this.listenEvents(); 
    }
  }

  dispose() {
    if (this.overlayRef) {
      if (this.config.fade) {
        fromEvent(this.backdropElement, 'transitionend').pipe(takeUntil(this.detachment$)).subscribe(() => {
          console.log('transition end');
          this.destory();
        })
        this.rd2.removeClass(this.backdropElement, 'overlay-mask-show')
      } else {
        this.destory();
      }
    }
  }

  listenEvents(): void {
    merge(
      fromEvent(this.backdropElement, 'click'),
      fromEvent(this.doc, 'keyup')
    ).pipe(takeUntil(this.detachment$)).subscribe((event) => {
      if (event instanceof KeyboardEvent) {
        this.backdropKeyup$.next(event);
      } else if (event instanceof MouseEvent) {
        this.backdropClicck$.next(event);
      }
    });
  }

  private destory(){
    this.detachment$.next();
    this.detachment$.complete()
    this.rd2.removeChild(this.doc.body, this.overlayRef!.container)
    this.overlayRef = null;
  }
}

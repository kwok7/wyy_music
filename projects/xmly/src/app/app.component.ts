import { CategoryService } from './services/business/category.service';
import { AlbumService } from './services/apis/album.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Category } from './services/apis/types';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { filter, map, combineLatest, switchMap, empty, of, pluck, Observable, Subscription } from 'rxjs';
import { OverlayService, OverlayRef } from './services/tools/overlay.service';
import { merge } from 'lodash';

@Component({
  selector: 'xm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'xmly';
  currentCategory?: Category;
  categories: Category[] = [];
  categoryPinyin = '';
  subcategories: string[] = [];

  showLogin = false;

  private overlayRef?: OverlayRef | null;
  private overlaySub?: Subscription | null;
  constructor(
    private albumService: AlbumService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private categoryService: CategoryService,
    private overlayService: OverlayService,

  ) {
    // 使用路由服务来获取子路由的更新变化，而不是使用CategoryService
    // this.router.events.subscribe(e=>{
    //   if(e instanceof NavigationEnd){
    //     const urlArr:string[] = e.urlAfterRedirects.split('/');
    //     const categoryName:string = urlArr[urlArr.length-1]
    //     this.currentCategory = this.categories?.find(c=>c.pinyin===categoryName)
    //     this.cdr.markForCheck();
    //   }
    // })
  }

  ngOnInit(): void {
    this.init();
  }

  private init() {
    combineLatest(
      this.categoryService.getSubCategory(),
      this.categoryService.getCategory()
    ).subscribe(
      ([subCategories, category]) => {
        if (category !== this.categoryPinyin) {
          this.categoryPinyin = category;
        }
        this.subcategories = subCategories
      }
    );

    if (this.categories.length) {
      this.setCurrentCategory();
    } else {
      this.getCategories();
    }


    // this.categoryService.getCategory().subscribe(
    //   (c: string) => {
    //     if (this.categoryPinyin !== c) {
    //       this.categoryPinyin = c;
    //       if (this.categories.length) {
    //         this.setCurrentCategory();
    //       }
    //       else {
    //         this.getCategories();
    //       }
    //     }
    //   }
    // )
  }

  changeCategory(category: Category): void {
    // console.log(category.pinyin);
    // if(this.currentCategory?.id!==category.id){
    this.currentCategory = category;
    this.categoryService.setCategory(category.pinyin)
    this.router.navigateByUrl('/albums/' + category.pinyin);
    // }
  }

  getCategories(): void {
    this.albumService.categories().subscribe(res => {
      this.categories = res;
      this.setCurrentCategory();
      this.cdr.markForCheck();
    })
  }

  setCurrentCategory() {
    this.currentCategory = this.categories.find(c => c.pinyin === this.categoryPinyin)
  }

  showOverlay() {
    this.overlayRef = this.overlayService.create({ fade: true, bakckgroundColor: 'rgba(0,0,0,.32)' });
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
      this.hideOverlay();
    })
  }

  hideOverlay(): void {
    if (this.overlaySub) {
      this.overlaySub.unsubscribe();
      this.overlaySub = null;
    }
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }

  handleLogin(){
    this.showLogin = true;
    this.cdr.markForCheck()
  }
  
}

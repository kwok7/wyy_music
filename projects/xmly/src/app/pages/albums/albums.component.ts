import { CategoryService } from './../../services/business/category.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AlbumArgs, AlbumService, AlbumsInfo, CategoryInfo } from '../../services/apis/album.service';
import { Album, MetaData, MetaValue, SubCategory } from '../../services/apis/types';
import { ActivatedRoute, ActivatedRouteSnapshot, ActivationEnd, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, forkJoin, map, switchMap, tap, withLatestFrom } from 'rxjs';
import { WindowService } from '../../services/tools/window.service';
import { storageKeys } from '../../config';

interface CheckedMeta {
  metaRowId: number;
  metaRowName: string;
  metaId: number;
  metaName: string;
}

@Component({
  selector: 'xm-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumsComponent {
  searchParams: AlbumArgs = {
    category: 'youshengshu',
    subcategory: '',
    meta: '',
    sort: 0,
    page: 1,
    perPage: 30
  };
  sorts = ['综合排序', '最近更新', '播放最多'];

  categoryInfo?: CategoryInfo;
  checkedMetas: CheckedMeta[] = [];
  albumsInfo?: AlbumsInfo;

  tagColor ='orange';

  total=260;


  constructor(
    private albumService: AlbumService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private windowService: WindowService
  ) {
    //使用路由监听来获取pinyin字段的变量，并且更新二三级目录
    // this.route.paramMap.subscribe(
    //   (p: ParamMap) => {
    //     const category=p.get('pinyin')||'youshengshu';
    //     if(category!==this.searchParams.category){
    //       this.searchParams.category = category;
    //       this.updatePageData();
    //     }
    //   }
    // )

    //使用service来订阅 category pinyin的变化，从而更新组件内容，与上面的监听路由方法不一样，但是效果相同
    //这里使用 map, switchMap
    // this.categoryService.getCategory().pipe(
    //   map(
    //     (c:string)=>{
    //       this.searchParams.category = c;
    //       return this.searchParams;
    //     }
    //   ),
    //   switchMap(
    //     (s:AlbumArgs)=>{
    //       return this.albumService.detailCategoryPageInfo(s)
    //     }
    //   )
    // ).subscribe((categoryInfo:CategoryInfo)=>{
    //   console.log(categoryInfo);
    //   this.categoryInfo = categoryInfo;
    //   this.cdr.markForCheck();
    // })
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.updatePageData();

    this.route.paramMap.pipe(withLatestFrom(this.categoryService.getCategory()))
      .subscribe(([paramMap, category]) => {
        const pinyin = paramMap.get('pinyin');
        let needSetStatus = false;
        if (pinyin !== category) {
          this.categoryService.setCategory(pinyin!);
          this.clearSubCategory();
          this.uncheckMeta('clear')
        }else{
          const cacheSubCatory = this.windowService.getStorage(storageKeys.subcategoryCode)
          const cacheMetas = this.windowService.getStorage(storageKeys.metas)
          if(cacheSubCatory){
            this.searchParams.subcategory = cacheSubCatory
            needSetStatus = true;
          }
          if(cacheMetas){
            this.searchParams.meta = cacheMetas
            needSetStatus = true;
          }
        }
        this.updatePageData(needSetStatus);
      });
  }

  private updatePageData(neetSetStatus=false) {

    forkJoin([
      this.albumService.albums(this.searchParams),
      this.albumService.detailCategoryPageInfo(this.searchParams)
    ]
    ).subscribe(
      ([albumsInfo, categoryInfo]) => {
        this.albumsInfo = albumsInfo
        this.categoryInfo = categoryInfo;
        if (neetSetStatus) {
          this.setStatus(categoryInfo);
        }
        this.cdr.markForCheck();
      }
    )
  }

  private setStatus({ metadata, subcategories }: CategoryInfo){
    const subCategory = subcategories.find(item => item.code === this.searchParams.subcategory);
    console.log('metadata', metadata);
    if (subCategory) {
      this.categoryService.setSubCategory([subCategory.displayValue]);
    }
    if (this.searchParams.meta) {
      // 19_156-22_4433
      const metasMap = this.searchParams.meta.split('-').map(item => item.split('_'));
      console.log('metasMap', metasMap);
      metasMap.forEach(meta => {
        const targetRow = metadata.find(row => row.id === Number(meta[0]));
        // console.log('targetRow', targetRow);
        // 从详情导航过来的标签不一定存在
        const { id: metaRowId, name, metaValues } = targetRow || metadata[0];
        const targetMeta = metaValues.find(item => item.id === Number(meta[1]));
        const { id, displayName } = targetMeta || metaValues[0];
        this.checkedMetas.push({
          metaRowId,
          metaRowName: name,
          metaId: id,
          metaName: displayName
        });
      });

    }
  }

  changeSubcategory(subCategory?: SubCategory): void {
    console.log('subCategory', subCategory);
    if (subCategory) {
      this.searchParams.subcategory = subCategory.code;
      this.categoryService.setSubCategory([subCategory.displayValue]);
      this.windowService.setStorage(storageKeys.subcategoryCode, this.searchParams.subcategory);
    } else {
      this.clearSubCategory();
    }
    this.uncheckMeta('clear');
    this.updatePageData();
  }

  showMetaRow(name: string): boolean {
    if (this.checkedMetas.length) {
      return this.checkedMetas.find(metas => metas.metaRowName === name) ? false : true;
    } else return true;
  }

  checkMeta(row: MetaData, item: MetaValue) {
    this.checkedMetas.push({
      metaRowId: row.id,
      metaRowName: row.name,
      metaId: item.id,
      metaName: item.displayName
    })
    this.searchParams.meta = this.getMetaParams();
    this.updateAlbums();
    this.windowService.setStorage(storageKeys.metas,this.searchParams.meta)
  }

  uncheckMeta(item: CheckedMeta | 'clear') {
    if (item === 'clear') {
      this.checkedMetas = []
      this.searchParams.meta = '';
      this.windowService.removeStorage(storageKeys.metas)
    } else {
      const targetIndex = this.checkedMetas.findIndex(ele => (ele.metaRowName === item.metaRowName) && (ele.metaName === item.metaName));
      if (targetIndex > -1) {
        this.checkedMetas.splice(targetIndex, 1)
        this.searchParams.meta = this.getMetaParams();
      }
    }
    this.updateAlbums();
    this.windowService.setStorage(storageKeys.metas,this.searchParams.meta)
  }

  changeSort(i:number){
    this.searchParams.sort=i;
    this.albumService.albums(this.searchParams).subscribe(res=>this.albumsInfo = res)
  }

  private clearSubCategory():void{
    this.searchParams.subcategory = '';
    this.categoryService.setSubCategory([]);
    this.windowService.removeStorage(storageKeys.subcategoryCode);
  }

  private getMetaParams(): string {
    let result = '';
    if (this.checkedMetas.length) {
      this.checkedMetas.forEach(
        (e: CheckedMeta, index: number) => {
          // if (index !== (this.checkedMetas.length - 1)) {
          //   result = result + e.metaRowId + '_' + e.metaId + '-'
          // } else {
          //   result = result + e.metaRowId + '_' + e.metaId
          // }
          result = result + e.metaRowId + '_' + e.metaId + '-'
        }
      );
      result = result.slice(0, -1)
    }
    console.log(result);
    return result;
  }

  private updateAlbums():void{
    this.albumService.albums(this.searchParams).subscribe(res=>this.albumsInfo=res)
  }

  changePage(newPageNum:number):void{
    if(this.searchParams.page!==newPageNum){
      this.searchParams.page = newPageNum;
    }
  }

  trackBySubCategories(index: number, item: SubCategory): string { return item.code }
  trackByMetas(index: number, item: MetaValue): number { return item.id }
  trackByAlbums(index:number,item:Album):number{return item.albumId}
}

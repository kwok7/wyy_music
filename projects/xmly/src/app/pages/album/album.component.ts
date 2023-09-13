import { AlbumRes, AlbumService, AlbumTrackArgs } from './../../services/apis/album.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumInfo, Anchor, RelateAlbum, Track } from '../../services/apis/types';
import { first, forkJoin } from 'rxjs';
import { CategoryService } from '../../services/business/category.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { checkStatus } from '../../share/components/checkbox/checkbox.component';
import { OverlayService } from '../../services/tools/overlay.service';
interface moreStateType {
  label: '展开全部' | '收起';
  icon: 'arrow-down-line' | 'arrow-up-line';
  full: boolean;
}
interface checkValueType {
  label: string,
  value: string
}
@Component({
  selector: 'xm-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumComponent {
  anchor?: Anchor;
  tracks: Track[] = [];
  total = 0;
  trackParams: AlbumTrackArgs = {
    albumId: '',
    sort: 1,
    pageNum: 1,
    pageSize: 30
  };
  albumInfo?: AlbumInfo;

  album?: AlbumRes;
  score = 0;
  relatedAlbums: RelateAlbum[] = [];

  selectedTracks: Track[] = [];

  moreState: moreStateType = {
    full: false,
    label: '展开全部',
    icon: 'arrow-down-line'
  }

  checkOptionsOne: checkValueType[] = [
    { label: '苹果', value: 'Apple' },
    { label: '梨', value: 'Pear' },
    { label: '橘子', value: 'Orange' }
  ];

  currentChecks = ['Pear']

  // formGroup = this.fb.group({
  //   name: [''],
  //   // apple: [{value:false,disabled:true}],
  //   apple: [false]
  // });



  constructor(
    private route: ActivatedRoute,
    private albumService: AlbumService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.trackParams.albumId = paramMap.get('albumId')!;
      this.initPageData();
    });
  }

  toggleMore() {
    this.moreState.full = !this.moreState.full;
    if (this.moreState.full) {
      this.moreState.label = '收起';
      this.moreState.icon = 'arrow-up-line'
    } else {
      this.moreState.label = '展开全部';
      this.moreState.icon = 'arrow-down-line'
    }
  }


  updateCheckbox(ev: checkStatus, value: string) {
    if (ev === 'add') {
      if (!this.currentChecks.includes(value)) {
        this.currentChecks.push(value)
        this.cdr.markForCheck()
      }
    } else if (ev === 'remove') {
      if (this.currentChecks.includes(value)) {
        const index = this.currentChecks.findIndex((i: string) => i === value)
        if (index > -1) {
          this.currentChecks.splice(index, 1)
          this.cdr.markForCheck()
        }
      }
    }
  }

  private selectedIndex(id: number): number {
    return this.selectedTracks.findIndex(item => item.trackId === id);
  }

  changePage(ev: number) {
    console.log('ev', ev);
    if (ev !== this.trackParams.pageNum) {
      this.trackParams.pageNum = ev;
      this.updateTracks();
    }
  }

  updateTracks() {
    this.albumService.tracks(this.trackParams)
    .subscribe(
      res => {
        this.tracks = res.tracks
        this.total = res.trackTotalCount
      }
    )
  }

  checkedChange(checked: boolean, track: Track): void {
    const targetIndex = this.selectedIndex(track.trackId);
    if (checked) {
      if (targetIndex === -1) {
        this.selectedTracks.push(track);
      }
    } else {
      if (targetIndex > -1) {
        this.selectedTracks.splice(targetIndex, 1);
      }
    }
    console.log('selectedTracks', this.selectedTracks);
  }
  isChecked(id: number): boolean {
    return this.selectedIndex(id) > -1;
  }
  checkAllChange(checked:any): void {
    this.tracks.forEach(item => {
      const targetIndex = this.selectedIndex(item.trackId);
      if (checked) {
        if (targetIndex === -1) {
          this.selectedTracks.push(item);
        }
      } else {
        if (targetIndex > -1) {
          this.selectedTracks.splice(targetIndex, 1);
        }
      }
    });
  }

  private initPageData(): void {
    forkJoin([
      this.albumService.album(this.trackParams.albumId),
      this.albumService.albumScore(this.trackParams.albumId),
      this.albumService.relateAlbums(this.trackParams.albumId),
    ]).subscribe(([albumInfo, score, relateAlbums]) => {
      // console.log('albumInfo', albumInfo);
      // console.log('score', score);
      // console.log('relateAlbum', relateAlbum);
      this.albumInfo = { ...albumInfo.mainInfo, albumId: albumInfo.albumId };
      this.score = score;
      this.anchor = albumInfo.anchorInfo;
      // this.tracks = albumInfo.tracksInfo.tracks;
      // this.total = albumInfo.tracksInfo.trackTotalCount;
      this.updateTracks();
      this.relatedAlbums = relateAlbums.slice(0, 10);
     /* const category = localStorage.getItem('categoryPinyin');
      const { categoryPinyin } = this.albumInfo.crumbs;
      if (category !== categoryPinyin) {
        this.categoryServe.setCategory(categoryPinyin);
      }*/
      this.categoryService.getCategory().pipe(first()).subscribe(category => {
        const { categoryPinyin } = this.albumInfo!.crumbs;
        if (category !== categoryPinyin) {
          this.categoryService.setCategory(categoryPinyin);
        }
      });
      this.categoryService.setSubCategory([this.albumInfo.albumTitle]);
      this.cdr.markForCheck();
    });
  }

  isCheckedAll(): boolean {
    if (this.selectedTracks.length >= this.tracks.length) {
      return this.tracks.every(item => {
        return this.selectedIndex(item.trackId) > -1;
      });
    }
    return false;
  }

 


  trackByTracks(index: number, item: Track): number { return item.trackId }
}

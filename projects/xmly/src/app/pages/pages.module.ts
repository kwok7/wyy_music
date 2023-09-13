import { NgModule } from '@angular/core';
import { AlbumsModule } from './albums/albums.module';



@NgModule({
  declarations: [],
  imports: [
    AlbumsModule
  ],
  exports:[
    AlbumsModule
  ]
})
export class PagesModule { }

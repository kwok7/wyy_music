import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './layouts/header/header.component';
import { ShareModule } from './share/share.module';
import { BreadcrumbModule } from './share/components/breadcrumb/breadcrumb.module';
import { HttpClientModule } from '@angular/common/http';
import { PagesModule } from './pages/pages.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './layouts/login/login.component';
import { DirectivesModule } from './share/directives/directives.module';
import { CheckboxModule } from './share/components/checkbox/checkbox.module';


@NgModule({
  declarations: [
    HeaderComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    PagesModule,
    AppRoutingModule,
    ShareModule, 
    BreadcrumbModule,
    HttpClientModule, 
    BrowserAnimationsModule,
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule
  ],
  exports: [
    CommonModule,
    HeaderComponent,
    ShareModule,
    BreadcrumbModule,
    AppRoutingModule,
    LoginComponent
  ]
})
export class CoreModule {
  constructor(@SkipSelf() @Optional() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule只能被AppModule 引入')
    }
  }

}

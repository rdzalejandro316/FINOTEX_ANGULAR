import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AplicationModule, httpTranslateLoader } from './components/aplication/aplication.module';
import {  LoadingModule } from './shared/framework-ui/custom/loading/loading.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ROOT_REDUCERS } from './store/app.state';
import { ComponentsFormsModule } from './modules/shared/componentsforms.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BreadcrumbModule } from './shared/framework-ui/primeng/breadcrumb/breadcrumb';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AplicationModule,
    HttpClientModule,
    BreadcrumbModule,
    LoadingModule,
    StoreModule.forRoot(ROOT_REDUCERS),
    StoreDevtoolsModule.instrument({name:'TEST'}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
         useFactory: HttpLoaderFactory,
         deps: [HttpClient]
      },
      isolate:true
   })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

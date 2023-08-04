import {
  HttpClient, HTTP_INTERCEPTORS
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  MsalInterceptor, MsalInterceptorConfiguration, MsalRedirectComponent, MsalService, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG
} from '@azure/msal-angular';
import {
  InteractionType,
  IPublicClientApplication,
  PublicClientApplication
} from '@azure/msal-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from 'src/app/app.component';
import { InterceptorsTokenService } from 'src/app/core/services/interceptors/interceptors-token.service';
import { ImageDirective } from 'src/app/shared/framework-ui/custom/appImage/appImage.directive';
import { environment } from 'src/environments/environment';
import { ArtworksDetailsComponent } from '../artworks/artworks-details/artworks-details.component';
import { ArtworksEditComponent } from '../artworks/artworks-edit/artworks-edit.component';
import { ArtworksHistoryComponent } from '../artworks/artworks-history/artworks-history.component';
import { ArtworksNewComponent } from '../artworks/artworks-new/artworks-new.component';
import { BrandProductsDetailComponent } from '../brand-products/brand-products-detail/brand-products-detail.component';
import { BrandProductsEditComponent } from '../brand-products/brand-products-edit/brand-products-edit.component';
import { BrandProductsListComponent } from '../brand-products/brand-products-list/brand-products-list.component';
import { BrandProductsNewComponent } from '../brand-products/brand-products-new/brand-products-new.component';
import { PuchaseOrderComponent } from '../brand-products/puchase-order/puchase-order.component';
import { BasicInformationComponent } from '../customers/basic-information/basic-information.component';
import { CustomersCardsComponent } from '../customers/customers-cards/customers-cards.component';
import { CustomersListComponent } from '../customers/customers-list/customers-list.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';
import { ProfilesComponent } from '../login/profiles/profiles.component';
import { CheckoutComponentProduct } from '../products/checkout/checkout.component';
import { ProductDetailComponent } from '../products/product-detail/product-detail.component';
import { ProductsListComponent } from '../products/products-list/products-list.component';
import { ShoppingCartComponent } from '../products/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from '../samples/checkout/checkout.component';
import { PurchaseOrderComponent } from '../samples/purchase-order/purchase-order.component';
import { SamplesListComponent } from '../samples/samples-list/samples-list.component';
import { FooterComponent } from '../ui/footer/footer.component';
import { NavbarComponent } from '../ui/navbar/navbar.component';
import { SidebarComponent } from '../ui/sidebar/sidebar.component';

import { FallbackSrcDirective } from 'src/app/shared/framework-ui/custom/appImage/fallback-src.directive';

import { TechnicalDevelopmentsComponent } from '../samples/technical-developments/technical-developments.component';

import { ComponentsFormsModule } from 'src/app/modules/shared/componentsforms.module';
import { InitComponent } from '../main/init/init.component';
import { MainComponent } from '../main/main.component';
import { NavBarMainComponent } from '../main/nav-bar-main/nav-bar-main.component';
import { ConsultPqrsComponent } from '../main/pqrs/consult-pqrs/consult-pqrs.component';
import { GeneratePqrsComponent } from '../main/pqrs/generate-pqrs/generate-pqrs.component';
import { InfoPqrsComponent } from '../main/pqrs/info-pqrs/info-pqrs.component';


export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: environment.authB2c,
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', [
    'user.read',
  ]);
  protectedResourceMap.set(
    'https://FinotexB2C.onmicrosoft.com/e8529ad6-7364-454a-afac-6c74edc7d5d3/access_as_user',
    ['access_as_user']
  );

  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap,
  };
}

@NgModule({
  declarations: [
    LoginComponent,
    HomeComponent,
    SidebarComponent,
    FooterComponent,
    NavbarComponent,
    DashboardComponent,
    ArtworksHistoryComponent,
    ArtworksNewComponent,
    SamplesListComponent,
    PurchaseOrderComponent,
    ArtworksDetailsComponent,
    ImageDirective,
    ProfilesComponent,
    BrandProductsListComponent,
    BrandProductsDetailComponent,
    BrandProductsNewComponent,
    BrandProductsEditComponent,
    PuchaseOrderComponent,
    CheckoutComponent,
    ArtworksEditComponent,
    ProductDetailComponent,
    ShoppingCartComponent,
    ProductsListComponent,
    CheckoutComponent,
    CheckoutComponentProduct,
    CustomersListComponent,
    CustomersCardsComponent,
    BasicInformationComponent,
    FallbackSrcDirective,
    TechnicalDevelopmentsComponent,
    InitComponent,
    MainComponent,
    NavBarMainComponent,
    InfoPqrsComponent, 
    GeneratePqrsComponent,
    ConsultPqrsComponent,        
  ],
  imports: [
    ComponentsFormsModule
  ],
  providers: [    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    MsalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorsTokenService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AplicationModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Home_sampleComponent } from './home_sample.component';
import { Home_sampleRoutingModule } from './home_sample-routing.module';
import { AdditionalPropertiesComponent } from './components/additional-properties/additional-properties.component';
import { AniloxComponent } from './components/anilox/anilox.component';
import { FormulaColorsComponent } from './components/color-formula/color-formula.component';
import { CustomerReferenceComponent } from './components/customer-reference/customer-reference.component';
import { GeneralDataOfSampleComponent } from './components/general-data-of-sample/general-data-of-sample.component';
import { HomologsComponent } from './components/homologs/homologs.component';
import { IdentificationDataComponent } from './components/identification-data/identification-data.component';
import { ImageSettingsComponent } from './components/image-settings/image-settings.component';
import { InventoryTweaksComponent } from './components/inventory-tweaks/inventory-tweaks.component';
import { MallasComponent } from './components/mallas/mallas.component';
import { MaterialsComponent } from './components/materials/materials.component';
import { QualityDataComponent } from './components/quality-data/quality-data.component';
import { TechnicalDataComponent } from './components/technical-data/technical-data.component';
import { TroquelComponent } from './components/troquel/troquel.component';
import { HomeSamplesComponent } from './components/home-samples/home-samples.component';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsalInterceptor, MsalInterceptorConfiguration, MsalService, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { InterceptorsTokenService } from 'src/app/core/services/interceptors/interceptors-token.service';
import { ComponentsFormsLazyModule } from '../shared/componentsformslazy.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { LoadingModule } from 'src/app/shared/framework-ui/custom/loading/loading.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { InteractionType, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';


export function createTranslateLoader(http: HttpClient) {
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

const components = [
  AdditionalPropertiesComponent,
  AniloxComponent,
  FormulaColorsComponent,
  CustomerReferenceComponent,
  GeneralDataOfSampleComponent,
  HomeSamplesComponent,
  HomologsComponent,
  IdentificationDataComponent,
  ImageSettingsComponent,
  InventoryTweaksComponent,
  MallasComponent,
  MaterialsComponent,
  QualityDataComponent,
  TechnicalDataComponent,
  TroquelComponent,
]

@NgModule({
  imports: [
    CommonModule,
    ComponentsFormsLazyModule,
    Home_sampleRoutingModule,
    TranslateModule.forChild({
      defaultLanguage: 'en',
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      },
      extend: true
  }),
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
  declarations: [...components]
})
export class Home_sampleModule { }

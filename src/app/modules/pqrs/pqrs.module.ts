import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PqrsRoutingModule } from './pqrs-routing.module';
import { InformationRequestComponent } from './edit-pqrs/components/information-request/information-request.component';
import { DetailRequestComponent } from './edit-pqrs/components/detail-request/detail-request.component';
import { InformationAdditionalComponent } from './edit-pqrs/components/information-additional/information-additional.component';
import { ActionPlanComponent } from './edit-pqrs/components/action-plan/action-plan.component';
import { CustomerResponseComponent } from './edit-pqrs/components/customer-response/customer-response.component';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsalInterceptor, MsalInterceptorConfiguration, MsalService, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { InterceptorsTokenService } from 'src/app/core/services/interceptors/interceptors-token.service';
import { ComponentsFormsLazyModule } from '../shared/componentsformslazy.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { InteractionType, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';
import { ManagmentPqrsComponent } from './managment-pqrs/managment-pqrs.component';
import { EditPqrsComponent } from './edit-pqrs/edit-pqrs.component';
import { SortService } from 'src/app/core/services/sort/sort.service';
import { SortableTableDirective } from 'src/app/shared/framework-ui/custom/sortable-column/sortable.directive';
import { SortableColumnComponent } from 'src/app/shared/framework-ui/custom/sortable-column/sortable-column.component';
import { ManagementRequestComponent } from './edit-pqrs/components/management-request/management-request.component';
import { GenerateCustomerPqrsComponent } from './customer/generate-customer-pqrs/generate-customer-pqrs.component';
import { ManagmentCustomerPqrsComponent } from './customer/managment-customer-pqrs/managment-customer-pqrs.component';

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
    ManagmentPqrsComponent,  
    EditPqrsComponent,  
    InformationRequestComponent,
    DetailRequestComponent,
    InformationAdditionalComponent,
    ActionPlanComponent,
    CustomerResponseComponent,    
    SortableTableDirective,
    SortableColumnComponent,
    ManagementRequestComponent,
    GenerateCustomerPqrsComponent, 
    ManagmentCustomerPqrsComponent
]

@NgModule({
    imports: [
        CommonModule,
        ComponentsFormsLazyModule,
        PqrsRoutingModule,
        TranslateModule.forChild({            
            loader: {
              provide: TranslateLoader,
              useFactory: createTranslateLoader,
              deps: [HttpClient]
            }
        })
    ],
    providers: [
        SortService,
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
export class PqrsModule { }

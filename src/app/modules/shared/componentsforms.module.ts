import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsalInterceptor, MsalModule, MsalService, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { httpTranslateLoader, MSALInstanceFactory, MSALInterceptorConfigFactory } from 'src/app/components/aplication/aplication.module';
import { InterceptorsTokenService } from 'src/app/core/services/interceptors/interceptors-token.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@microsoft/signalr';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CoreModule } from 'src/app/core/core/core.module';
import { ButtonModule } from 'src/app/shared/framework-ui/primeng/button/button';
import { CardModule } from 'src/app/shared/framework-ui/primeng/card/card';
import { InputTextModule } from 'src/app/shared/framework-ui/primeng/inputtext/inputtext';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DropdownModule } from 'src/app/shared/framework-ui/primeng/dropdown/dropdown';
import { DialogModule } from 'src/app/shared/framework-ui/primeng/dialog/dialog';
import { InputTextareaModule } from 'src/app/shared/framework-ui/primeng/inputtextarea/inputtextarea';
import { MultiSelectModule } from 'src/app/shared/framework-ui/primeng/multiselect/multiselect';
import { TooltipModule } from 'src/app/shared/framework-ui/primeng/tooltip/tooltip';
import { RippleModule } from 'src/app/shared/framework-ui/primeng/ripple/ripple';
import { AccordionModule } from 'src/app/shared/framework-ui/primeng/accordion/accordion';
import { CheckboxModule } from 'src/app/shared/framework-ui/primeng/checkbox/checkbox';
import { ToastModule } from 'src/app/shared/framework-ui/primeng/toast/toast';
import { RadioButtonModule } from 'src/app/shared/framework-ui/primeng/radiobutton/radiobutton';
import { TableModule } from 'src/app/shared/framework-ui/primeng/table/table';
import { PaginatorModule } from 'src/app/shared/framework-ui/primeng/paginator/paginator';
import { BreadcrumbModule } from 'src/app/shared/framework-ui/primeng/breadcrumb/breadcrumb';
import { TimelineModule } from 'src/app/shared/framework-ui/primeng/timeline/timeline';
import { ContextMenuModule } from 'src/app/shared/framework-ui/primeng/contextmenu/contextmenu';
import { InputNumberModule } from 'src/app/shared/framework-ui/primeng/inputnumber/inputnumber';
import { ButtonFinotexModule } from 'src/app/shared/framework-ui/custom/button-finotex/button-finotex.component';
import { SearchSelectorFinotexModule } from 'src/app/shared/framework-ui/custom/search-selector/search-selector.component';
import { ShoppingCartModule } from 'src/app/shared/framework-ui/custom/shopping-cart-finotex/shopping-cart-finotex.component';
import { DatepickerComponentModule } from 'src/app/shared/framework-ui/custom/datepicker/datepicker.component';
import { CalendarModule } from 'src/app/shared/framework-ui/primeng/calendar/calendar';
import { TabMenuModule } from 'src/app/shared/framework-ui/primeng/tabmenu/tabmenu';
import { TabViewModule } from 'src/app/shared/framework-ui/primeng/tabview/tabview';
import { TableModuleFinotex } from 'src/app/shared/framework-ui/primeng/tablafinotex/table';
import { viewerModule } from 'src/app/shared/framework-ui/custom/viewer/viewer.component';
import { InputSwitchModule } from 'src/app/shared/framework-ui/primeng/inputswitch/inputswitch';


const components = [
 
]
  

@NgModule({
  imports: [
    CommonModule,
    BreadcrumbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CoreModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    AutocompleteLibModule,
    DropdownModule,
    DialogModule,
    InputTextareaModule,
    MultiSelectModule,
    TooltipModule,
    RippleModule,
    AccordionModule,
    CheckboxModule,
    ToastModule,
    RadioButtonModule,
    TableModule,
    PaginatorModule,
    TooltipModule,
    MsalModule,
    
    TimelineModule,
    ContextMenuModule,
    InputNumberModule,
    ButtonFinotexModule,
    SearchSelectorFinotexModule,
    ShoppingCartModule,
    DatepickerComponentModule,
    CalendarModule,
    TabMenuModule,
    TabViewModule,
    TableModuleFinotex,
    viewerModule,
    InputSwitchModule,
    TranslateModule.forChild({
      loader: { provide: TranslateLoader, useFactory: httpTranslateLoader, deps: [HttpClient] },
      isolate: true
    })
  ],
  providers: [
  ],
  exports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    RouterModule,
    CoreModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    AutocompleteLibModule,
    DropdownModule,
    DialogModule,
    InputTextareaModule,
    MultiSelectModule,
    TooltipModule,
    RippleModule,
    AccordionModule,
    CheckboxModule,
    ToastModule,
    RadioButtonModule,
    TableModule,
    PaginatorModule,
    TooltipModule,
    MsalModule,
    TimelineModule,
    ContextMenuModule,
    InputNumberModule,
    ButtonFinotexModule,
    SearchSelectorFinotexModule,
    ShoppingCartModule,
    DatepickerComponentModule,
    CalendarModule,
    TabMenuModule,
    TabViewModule,
    TableModuleFinotex,
    viewerModule,
    InputSwitchModule,
    TranslateModule
  ],

  declarations: [...components]
})
export class ComponentsFormsModule { }

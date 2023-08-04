import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ArtworksService } from '../services/artworks/artworks.service';
import { ProductService } from '../services/product/product.service';
import { SalesService } from '../services/sales/sales.service';
import { SharedService } from '../services/shared/shared.service';
import { SketchService } from '../services/sketch/sketch.service';
import { CustomerService } from '../services/customer/customer.service';
import { MasterSalesService } from '../services/master-sales/master-sales.service';
import { ProfilesService } from '../services/profile/profiles.service';
import { UtilitiesService } from '../services/utilities/utilities.service';
import { TechinicalService } from '../services/technical-sheets/techinical.service';
import { LoadingService } from '../services/loading/loading.service';
import { AniloxService } from '../services/anilox/anilox.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    ArtworksService,
    ProductService,
    SalesService,
    CustomerService,
    MasterSalesService,
    SharedService,
    SketchService,
    ProfilesService,
    UtilitiesService,
    TechinicalService,
    LoadingService,
    AniloxService,
    DatePipe
  ],
})
export class CoreModule { }

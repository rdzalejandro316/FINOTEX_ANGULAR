import { Component, OnInit } from '@angular/core';
import { BrandService } from 'src/app/core/services/brand/brand.service';
import { ProfilesService } from 'src/app/core/services/profile/profiles.service';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { CustomerType } from 'src/app/shared/constant/customertype.enum';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { BrandProductDto } from 'src/app/shared/models/brandproducto-dto';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

declare var $: any;

@Component({
  selector: 'app-brand-products-detail',
  templateUrl: './brand-products-detail.component.html',
  styleUrls: ['./brand-products-detail.component.css'],
  providers: [MessageService],
})
export class BrandProductsDetailComponent implements OnInit {
  product: BrandProductDto;
  lang = 'en';
  displayFilePreview: boolean = false;
  eCustomerType = CustomerType;
  indicatorButton = false;
  totalRecordsPricing: number = 0;
  currentPagePricing: number = 1;
  pageLenghtPricing = environment.pageLenght;
  brandProductPricing = [];
  totalRecordsDetail: number = 0;
  currentPageDetail: number = 1;
  brandProductDetails = [];
  pageLenghtDetail = environment.pageLenght;
  statusProductsByBrand: string = '';
  imageGaleryBrandDatail = "";

  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.AllProducts', url: '/home/all_product' },
    { label: 'product-brand.lblProductsByBrand', url: '/home/brandProducts' },
    {
      label: 'product-brand-detail.titleMain',
      url: '/home/brandProductsDetail',
      current: true,
    },
  ];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private readonly sharedService: SharedService,
    private brandService: BrandService,
    private profilesService: ProfilesService,
    private storageService: StorageService,
    private translate: TranslateService
  ) {}

  openPreviewFile(imgUrl: string) {
    this.displayFilePreview = true;
    this.imageGaleryBrandDatail = imgUrl;
  }

  showbrandProductsEdit(data: any) {
    this.storageService.addProductBrand(data);
    this.router.navigate(['home/brandProductsEdit']);
  }

  ngOnInit(): void {
    this.lang = this.storageService.getLanguage();
    moment.locale(this.lang);
    this.product = this.storageService.getProductBrand();
    this.getBrandCatalogProduct();
    this.getBrandCatalogPrices();
    this.statusProductsByBrand = this.product?.status;
    this.translate
      .get('product-brand-detail.decriptionMain')
      .subscribe((res: string) => {
        this.statusProductsByBrand = `${res} ${this.statusProductsByBrand}`;
      });
  }

  DownloadPdf() {
    const file = {
      fileType: 'application/pdf',
      fileName: this.product.adobeUrl,
      isMain: false,
      fileUrl: 'brands',
      fileDataType: null,
      fileTemporal: this.product.adobeUrlTmp,
      businessId: -1,
      language: 'SP',
    };
    this.downloadFile(file);
  }

  downloadFile(file) {
    if (file) {
      const link = document.createElement('a');
      if (file.fileTemporal) {
        link.href = file.fileTemporal;
        link.download = file.fileName;
        link.click();
      }
    }
  }

  getBrandCatalogProduct(): void {
    this.indicatorButton = true;
    let datos = {
      brandCatalogId: this.product.brandCatalogId,
    };

    this.brandService.getBrandCatalogProduct(datos).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            if (this.isCustomerContr) {
              let ListDetails = response.data;
              if (ListDetails.length > 0) {
                const listDetailsFilter = ListDetails.filter(
                  (e) =>
                    e.companyId === this.storageService.getProfiles().businessId
                );

                this.brandProductDetails =
                  listDetailsFilter.length > 0 ? listDetailsFilter : [];
                this.totalRecordsDetail =
                  listDetailsFilter.length > 0 ? listDetailsFilter.length : 0;
              }
            } else {
              this.brandProductDetails = response.data;
              this.totalRecordsDetail = response.quantity;
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
        } else {
          this.brandProductDetails = [];
          this.totalRecordsDetail = 0;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se encontraron',
          });
        }
      },
      (error) => {
        this.indicatorButton = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => {
        this.indicatorButton = false;
      }
    );
  }

  getBrandCatalogPrices(): void {
    this.indicatorButton = true;
    let datos = {
      brandCatalogId: this.product.brandCatalogId,
    };

    this.brandService.getBrandCatalogPrices(datos).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.brandProductPricing = response.data;
            this.totalRecordsPricing = response.quantity;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
        } else {
          this.brandProductPricing = [];
          this.totalRecordsPricing = 0;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se encontraron',
          });
        }
      },
      (error) => {
        this.indicatorButton = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => {
        this.indicatorButton = false;
      }
    );
  }

  paginate(event) {
    this.currentPageDetail = event.page + 1;
    this.pageLenghtDetail = event.rows;
    this.getBrandCatalogProduct();
  }

  get showBrandCustomer(): Boolean {
    return !this.profilesService.validateUserType();
  }

  get isCustomerContr(): Boolean {
    return this.profilesService.validateRolBuilderContrator();
  }

  get showContractor(): Boolean {
    return !this.profilesService.validateRolBuilderContrator();
  }

  FormatD(date: string): string {
    if (date) {    
      return moment(this.product.latestVersion).format('MMM/DD/YY').replace('.','').toUpperCase();;
    }
    return '';
  }
}

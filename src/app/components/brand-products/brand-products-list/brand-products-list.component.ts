import { DatePipe } from '@angular/common';
import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatepickerComponent } from 'src/app/shared/framework-ui/custom/datepicker/datepicker.component';
import { TranslateService } from '@ngx-translate/core';
import { CustomerType } from 'src/app/shared/constant/customertype.enum';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { ExcelService } from 'src/app/core/services/excel/excel.service';
import { BrandService } from 'src/app/core/services/brand/brand.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/public_api';
import { BrandProductDto } from 'src/app/shared/models/brandproducto-dto';
import { environment } from 'src/environments/environment';
import { MasterProductService } from 'src/app/core/services/masterProduct/master-product.service';
import { ProductDetailDto } from 'src/app/shared/models/product-detail-dto';
import { UtilitiesService } from 'src/app/core/services/utilities/utilities.service';
import { ProductItemCartBrandDto } from 'src/app/shared/models/product-item-cart-brand-dto';
import { ProfilesService } from 'src/app/core/services/profile/profiles.service';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-brand-products-list',
  templateUrl: './brand-products-list.component.html',
  styleUrls: ['./brand-products-list.component.css'],
  providers: [MessageService, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandProductsListComponent implements OnInit, AfterViewChecked {
  @ViewChild('ngForm') ngForm: FormGroupDirective;
  @ViewChild(DatepickerComponent) datePicker: DatepickerComponent;
  registerFormFilter: FormGroup;
  form: FormGroup;
  listBrandProducts: Array<BrandProductDto> = [];
  selectedBrandProduct: BrandProductDto;
  items: BrandProductDto[];
  dtOptions: any = {};
  checked: boolean = true;
  showfilters: boolean;
  display: boolean = false;
  lang = 'en';
  submitted: boolean;
  eCustomerType = CustomerType;
  notDownloadExcel = false;
  status = [];
  brandCustomers = [];
  brandCustomer: any;
  customerProductCode: any;
  description: any;
  finalDimensions: any;
  productLine: any;
  productStatus: any;
  productLines = [];
  productsbybrand: any;
  indicatorButton = false;
  totalRecords: number = 0;
  currentPage: number = 1;
  pageLenght = environment.pageLenght;
  disabledSelectColor: boolean = false;
  disabledSelectSize: boolean = false;
  displayInvalidItem: boolean = false;
  displaysuccess: boolean = false;
  displayNoContentSizeAndColor: boolean;
  addedItem: ProductItemCartBrandDto = new ProductItemCartBrandDto();

  productsDetail: Array<ProductDetailDto> = [];
  productsSizes: Array<ProductDetailDto> = [];
  productsColor: Array<ProductDetailDto> = [];
  shoppingCart: Array<ProductItemCartBrandDto> = [];
  isSetFirstRequiredDate: boolean = false;
  settingsDates: any;
  firstRequiredDate: boolean = false;
  paramCustomerId = "";
  subscription: Subscription;
  displayFilePreview = false;
  imageGaleryBrand = "";

  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.Products', url: '/home/all_product' },
    {
      label: 'product-brand.lblBrandProducts',
      url: '/home/brandProducts',
      current: true,
    },
  ];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private storageService: StorageService,
    private brandService: BrandService,
    private masterProductService: MasterProductService,
    private excelService: ExcelService,
    private messageService: MessageService,
    private utilitiesService: UtilitiesService,
    private activatedRoute: ActivatedRoute,
    private profilesService: ProfilesService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getFormFilter();
    this.getForm();
    this.getTranslations();

    this.subscription = this.activatedRoute.paramMap.subscribe((params) => {
      this.paramCustomerId = params.get('customerId');      
    });

    this.shoppingCart =
      this.storageService.getItemFromBrandProductShoppingCart();
    this.serviceBrandCustomers();

    this.callDefaultBrandProducts();
    this.groupLineGet();
    this.getStatusFilter();

    this.selectedBrandProduct = this.storageService.getProductBrand();

    this.settingsDates = {
      minDate: 0,
      isRange: false,
      required: true,

      dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
      ids: ['requiredDate'],
      labels: 'samples.lblDate',
    };
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  getTranslations() {
    this.translate
      .stream('product-brand.lblBranCustomer')
      .subscribe((res: string) => {
        this.brandCustomer = res;
      });
    this.translate
      .stream('product-brand.lblCustomerIDCode')
      .subscribe((res: string) => {
        this.customerProductCode = res;
      });
    this.translate
      .stream('product-brand.lblDescription')
      .subscribe((res: string) => {
        this.description = res;
      });
    this.translate
      .stream('product-brand.lblFinalDimensions')
      .subscribe((res: string) => {
        this.finalDimensions = res;
      });
    this.translate
      .stream('product-brand.lblProductLine')
      .subscribe((res: string) => {
        this.productLine = res;
      });
    this.translate
      .stream('product-brand.lblStatus')
      .subscribe((res: string) => {
        this.productStatus = res;
      });
    this.translate
      .stream('product-brand.lblProductsByBrand')
      .subscribe((res: string) => {
        this.productsbybrand = res;
      });
  }

  getFormFilter() {
    return (this.registerFormFilter = this.formBuilder.group({
      businessId: ['', Validators.nullValidator],
      language: ['', Validators.nullValidator],
      page: ['', Validators.nullValidator],
      limit: ['', Validators.nullValidator],
      orderBy: ['', Validators.nullValidator],
      ascending: ['', Validators.nullValidator],
      masterCustomerId: ['', Validators.nullValidator],
      brandCatalogId: ['', Validators.nullValidator],
      brandCatalogCode: ['', Validators.nullValidator],
      brandCustomerName: ['', Validators.nullValidator],
      finalDimension: ['', Validators.nullValidator],
      groupLineId: ['', Validators.nullValidator],
      statusId: ['', Validators.nullValidator],
      customerId: ['', Validators.nullValidator],
    }));
  }

  getForm() {
    return (this.form = this.formBuilder.group({
      productId: [null, [Validators.required]],
      size: ['', [Validators.required]],
      colorVariation: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      requiredDate: [null, [Validators.required]],
      firstRequiredDate: [null, [Validators.nullValidator]],
    }));
  }

  get showBrandCustomer() {
    // Validar si el usuario es externo y si tiene el rol de contratista
    return this.profilesService.validateRolBuilderContrator();
  }

  get isCustomer() {
    return this.profilesService.validateUserType();
  }

  showDetails(data: any) {
    this.storageService.addProductBrand(data);
    this.router.navigate(['home/brandProductsDetail']);
  }

  showEdit(data: any) {
    this.storageService.addProductBrand(data);
    this.router.navigate(['home/brandProductsEdit']);
  }

  mapSample() {
    const brandProduct = new BrandProductDto();
    brandProduct.brandCatalogId = this.formBrand.brandCatalogId.value;
    brandProduct.brandCatalogName = this.formBrand.brandCatalogName.value;
    brandProduct.brandCatalogCode = this.formBrand.brandCatalogCode.value;
    brandProduct.finalDimension = this.formBrand.finalDimension.value;
    brandProduct.groupLineName = this.formBrand.groupLineName.value;

    return brandProduct;
  }

  get formBrand() {
    return this.form.controls;
  }

  public showPanelFilter() {
    this.showfilters = !this.showfilters;
    if (this.showfilters) {
      $('.main').css('margin-top', '16px');
    } else {
      $('.main').css('margin-top', '0px');
    }
  }

  callDefaultBrandProducts() {
    this.registerFormFilter.patchValue({
      page: this.currentPage,
      limit: this.pageLenght,
      orderBy: 'BrandCatalogId',
      ascending: true,
      masterCustomerId: this.registerFormFilter.get('masterCustomerId').value,
      brandCatalogId: null,
      brandCatalogCode: this.registerFormFilter.get('brandCatalogCode').value,
      brandCustomerName: this.registerFormFilter.get('brandCustomerName').value,
      finalDimension: this.registerFormFilter.get('finalDimension').value,
      groupLineId: this.registerFormFilter.get('groupLineId').value,
      statusId: this.registerFormFilter.get('statusId').value,
      customerId: this.getDefaultCustomer(),
    });    
    this.sketchFilterService();
  }

  getDefaultCustomer() {
    let customerId: string;
    if (this.paramCustomerId == "") {
      customerId = this.profilesService.validateRolBuilderContrator()
        ? this.storageService.getGrup()
        : null;
    } else {
      customerId = this.paramCustomerId;
    }
    return customerId;
  }

  sketchFilterService(): void {
    this.indicatorButton = true;
    this.brandService.brandFilter(this.registerFormFilter.value).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.listBrandProducts = response.data.items;
            this.totalRecords = response.data.totalCount;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
        } else {
          this.listBrandProducts = [];
          this.totalRecords = 0;
          this.translate
            .stream('general.msgDetailResponse')
            .subscribe((res: string) => {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: res,
              });
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
        $('#allTable').DataTable().destroy();
        this.reloadTableConfiguration();
      }
    );
  }

  groupLineGet() {
    this.masterProductService.getGroupLine().subscribe(
      (response) => {
        this.productLines = response.data;
      },
      (error) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => {}
    );
  }

  getStatusFilter() {
    this.brandService.getAllStatus().subscribe(
      (response) => {
        this.status = response.data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => {}
    );
  }

  filterStatus(id: number): string {
    const filter = this.status.filter(
      (mylist) => mylist.brandCatalogStatusId === id
    );
    return filter[0].brandCatalogStatusName;
  }

  clearFilter() {
    this.registerFormFilter.reset();
  }

  exportAsXLSX(): void {
    let productsExcel: any[] = [];
    const profileUser = this.storageService.getUserType();
    if (this.listBrandProducts.length > 0) {
      this.listBrandProducts.map((s) => {
        if (profileUser == '1') {
          productsExcel.push({
            [this.customerProductCode]: s.brandCatalogCode,
            [this.description]: s.brandCatalogName,
            [this.finalDimensions]: s.dimension,
            [this.productLine]: s.productType,
            [this.productStatus]: s.status,
          });
        } else {
          productsExcel.push({
            [this.brandCustomer]: s.brandCatalogName,
            [this.customerProductCode]: s.brandCatalogCode,
            [this.description]: s.brandCatalogName,
            [this.finalDimensions]: s.dimension,
            [this.productLine]: s.productType,
            [this.productStatus]: s.status,
          });
        }
      });

      this.notDownloadExcel = !(this.listBrandProducts.length > 0)!;
      if (this.listBrandProducts.length > 0) {
        this.excelService.exportAsExcelFile(
          productsExcel,
          this.productsbybrand
        );
      }
    }
  }

  downloadFile(product) {
    if (product) {
      const link = document.createElement('a');
      if (product.adobeUrlTmp) {
        link.href = product.adobeUrlTmp;
        link.download = product.adobeUrl;
        link.click();
      }
    }
  }

  onSubmitFilter(): void {
    this.callDefaultBrandProducts();
  }

  brandFilter(data: string){
    this.indicatorButton = true;
    this.brandService.brandFilter(this.registerFormFilter.value).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            if(data != null)
            {
              this.listBrandProducts = response.data.items;
              this.listBrandProducts = this.listBrandProducts.filter((x) => x.brandCustomerName.includes(data))
              this.totalRecords = response.data.totalCount;
            }
            else
            {
              this.listBrandProducts = [];
              this.totalRecords = 0;
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
        } else {
          this.listBrandProducts = [];
          this.totalRecords = 0;
          this.translate
            .stream('general.msgDetailResponse')
            .subscribe((res: string) => {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: res,
              });
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
  
  serviceBrandCustomers() {
    const data = {};
    this.brandService.getBrandCustomers(data).subscribe(
      (response) => {
        if (response.status) {
          this.brandCustomers = response.data;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => {}
    );
  }

  showCart(data: any) {
    this.storageService.addProductBrand(data);
    this.selectedBrandProduct = this.storageService.getProductBrand();
    this.productsColor = [];
    this.productsSizes = [];
    this.form.reset();
    let datos = {
      brandCatalogId: this.selectedBrandProduct.brandCatalogId,
    };
    this.brandService.getBrandCatalogProduct(datos).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.displayNoContentSizeAndColor = false;
            this.clearShoppingCartForm(response.data);
          } else {
            this.displayNoContentSizeAndColor = true;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
        } else {
          this.productsDetail = [];
          this.setDefaultValuesForm();
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
        this.productsColor = this.productsColor== null? []: this.productsColor;
        this.productsSizes = this.productsSizes== null? []: this.productsSizes;
        this.display = true;
        this.disabledSelectColor = this.productsColor?.length == 0;
        this.disabledSelectSize = this.productsSizes?.length == 0;

        if (this.productsColor?.length == 0 && this.productsSizes?.length == 0) {
          this.formBrand.size.setValue('N/A');
          this.formBrand.colorVariation.setValue('N/A');
        }
        this.getColorsBySizeParams('N/A');
        setTimeout(function () {
          if (!this.datePicker) {
            this.datePicker = new DatepickerComponent(
              this.translate,
              this.storageService
            );
          }
          this.settingsDates = {
            minDate: 0,
            isRange: false,
            required: true,

            dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
            ids: ['requiredDate'],
            labels: 'samples.lblDate',
          };
          this.datePicker.settings = this.settingsDates;
          this.datePicker._SingleDatePicker();
        }, 500);
      }
    );
  }

  setDefaultValuesForm() {
    this.formBrand.productId.setValue(this.selectedBrandProduct.brandCatalogCode);
    if (this.productsDetail || this.productsDetail.length == 0) {
      this.formBrand.size.setValue('N/A');
      this.getColorsBySizeParams('N/A');
    }
    if (this.productsColor?.length == 0 && this.productsSizes?.length == 0) {
      this.formBrand.size.setValue('N/A');
      this.formBrand.colorVariation.setValue('N/A');
    }
  }

  getColorsBySize(event: any) {
    this.getColorsBySizeParams(event.value);
  }

  get isCustomerContr(): Boolean {
    return this.profilesService.validateRolBuilderContrator();
  }

  getColorsBySizeParams(valueSize: any): void {
    try {
      var sizes = this.utilitiesService.groupBy(this.productsDetail, 'size');
      this.productsColor = sizes[valueSize] == null ?[]: sizes[valueSize];
      this.disabledSelectColor = this.productsColor.length == 0;
      if (this.productsColor.length >= 1) {
        this.formBrand.colorVariation.setValue(this.productsColor[0].color);
      }
    } catch (error) {
      console.error(error);
    }
  }

  getSizesByColor(event: any) {
    this.getSizesByColorFilter(event.value);
  }

  getSizesByColorFilter(color: any): void {
    var colors = this.utilitiesService.groupBy(this.productsDetail, 'color');
    this.productsSizes = colors[color];
    this.disabledSelectSize = this.productsSizes.length == 0;
  }

  clearShoppingCartForm(detail: Array<ProductDetailDto>) {
    detail.map((x) => {
      x.size = x.size ? x.size : 'N/A';
      x.color = x.color ? x.color : 'N/A';
    });

    let detailFilter = [];
    if (this.isCustomerContr) {
      if (detail.length > 0) {
        let filterDetail = detail.filter(
          (e) => e.companyId === this.storageService.getProfiles().businessId
        );
        detailFilter = filterDetail;
      }
    } else {
      detailFilter = detail;
    }

    let arrayUniqueBySize = [
      ...new Map(detailFilter.map((item) => [item['size'], item])).values(),
    ];
    let arrayUniqueByColor = [
      ...new Map(detailFilter.map((item) => [item['color'], item])).values(),
    ];

    this.productsDetail = detailFilter;
    this.productsSizes = arrayUniqueBySize == null? []: this.productsSizes;
    this.productsColor = arrayUniqueByColor == null? []: this.productsColor;

    this.disabledSelectColor = this.productsColor.length == 0;
    this.disabledSelectSize = this.productsSizes.length == 0;
    this.form.reset();
    this.setDefaultValuesForm();
  }

  setFirstRequiredDate() {
    if (this.isSetFirstRequiredDate) {
      this.formBrand.requiredDate.setValue(null);
      this.isSetFirstRequiredDate = false;
      $('#requiredDate').prop('disabled', false);
    } else {
      this.shoppingCart =
        this.storageService.getItemFromBrandProductShoppingCart();
      if (this.shoppingCart.length > 0) {
        this.formBrand.requiredDate.setValue(this.shoppingCart[0].requiredDate);
        this.isSetFirstRequiredDate = true;
        $('#requiredDate').prop('disabled', true);
      }
    }
  }

  addOrEditItem() {
    if (this.form.valid) {
      this.shoppingCart =
        this.storageService.getItemFromBrandProductShoppingCart();
      if (!this.shoppingCart) {
        this.shoppingCart = new Array<ProductItemCartBrandDto>();
      }

      let item: ProductItemCartBrandDto = {
        requiredDate: this.formBrand.requiredDate.value,
        size: this.formBrand.size.value,
        color: this.formBrand.colorVariation.value,
        quantity: this.formBrand.quantity.value,
        price: 0,
        ...this.selectedBrandProduct,
      };

      if (this.validateRepeated(item, this.shoppingCart)) {
        this.shoppingCart.push(item);
        this.addedItem = item;
        this.storageService.addItemToBrandProductShoppingCart(
          this.shoppingCart
        );
        this.form.reset();
        this.displaysuccess = true;
      } else {
        this.displayInvalidItem = true;
      }
    }
  }

  validateRepeated(
    item: ProductItemCartBrandDto,
    list: Array<ProductItemCartBrandDto>
  ) {
    return (
      list.find(
        (x) =>
          x.requiredDate === item.requiredDate &&
          x.color === item.color &&
          x.size === item.size &&
          x.quantity === item.quantity &&
          x.brandCatalogCode === item.brandCatalogCode
      ) == null
    );
  }

  goToAddVariation() {
    this.clearShoppingCartForm(this.productsDetail);
    this.isSetFirstRequiredDate = false;
    this.displaysuccess = false;
  }

  goToProductByBrandList() {
    this.isSetFirstRequiredDate = false;
    this.display = false;
    this.displaysuccess = false;
  }

  goToCheckout() {
    if (this.shoppingCart?.length > 0) {
      this.isSetFirstRequiredDate = false;
      this.display = false;
      this.displaysuccess = false;
      this.router.navigate(['home/brandProduct_puchase']);
    }
  }

  goToNewBrand(): void {
    this.router.navigate(['home/brandProductsNew']);
  }

  paginate(event: { page: number; rows: number; }) {
    this.currentPage = event.page + 1;
    this.pageLenght = event.rows;
    if (!this.profilesService.validateUserType()) {
      this.callDefaultBrandProducts();
    } else {
      this.onSubmitFilter();
    }
  }

  onSubmitFilterSearch(event: any): void {

  }

  reloadTableConfiguration(): void {
    $(function () {
      var configuration = {
        destroy: true,
        retrieve: true,
        searching: false,
        ordering: false,
        scrollX: false,
        scrollY: false,
        paging: false,
        info: false,
        responsive: {
          details: {
            renderer: function (_api: any, _rowIdx: any, columns: any) {
              var data = $.map(columns, function (col: { hidden: any; title: string; data: string; }, _i: any) {
                return col.hidden
                  ? '<div class="col-12 col-md-3 mb-2" >' +
                  '<label>' +
                  col.title +
                  '</label> ' +
                  '<input type="text" value="' +
                  col.data +
                  '" readonly class="form-control p-inputtext"/>' +
                  '</div>'
                  : '';
              }).join('');

              return data ? $('<div class="row"/>').append(data) : false;
            },
          },
        },
      };

      $('#allTable').DataTable(configuration).draw();
    });
  }

  showGaleryImg(product: any): void {
    this.imageGaleryBrand = product.imageUrlTmp;
    this.displayFilePreview = true;
  }

}

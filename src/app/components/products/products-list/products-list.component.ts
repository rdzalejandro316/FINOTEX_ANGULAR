import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ProductDto } from 'src/app/shared/models/producto-dto';
import { DatePipe } from '@angular/common';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from 'src/app/core/services/product/product.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { MasterProductService } from 'src/app/core/services/masterProduct/master-product.service';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { ShoppingCartComponentFinotex, ShoppingCartItemsDialog } from 'src/app/shared/framework-ui/custom/shopping-cart-finotex/shopping-cart-finotex.component';

declare var $: any;
$(function () {
  $('#search input').css('border-radius', '10px 0px 0px 10px ');
});

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
  providers: [DatePipe, MessageService],
})
export class ProductsListComponent implements OnInit {
  @ViewChild(ShoppingCartComponent) shoppingCart: ShoppingCartComponent;
  @ViewChild(ProductDetailComponent) productDetail: ProductDetailComponent;

  @ViewChild(ShoppingCartItemsDialog) shoppingCartItemsDialog: ShoppingCartItemsDialog;
  @ViewChild(ShoppingCartComponentFinotex) shoppingCartComponentFinotex : ShoppingCartComponentFinotex;
  
  @ViewChild('ngForm') ngForm: FormGroupDirective;

  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.AllProducts', url: '/home/all_product' },
    { label: 'menu.AllProducts', url: '/home/all_product', current: true },
  ];

  enableMultiple: boolean;
  showfilters: boolean;
  showConfirmAddItemToCart: boolean;
  selectedProductToAddToCart: ProductDto;
  repeatedItemMessage: string;
  productsListTable: Array<ProductDto> = [];
  productsCart: any[] = [];
  productsNames: Array<string> = [];
  productsCustCodes: Array<string> = [];
  productsSizes: Array<string> = [];
  productsDates: Array<string> = [];
  displayDetail: boolean = false;
  displayShopping: boolean = false;
  submitted: boolean;
  pageLenght = 12;
  productLinesFilter = [];

  SearchFormAllProduct: FormGroup;
  productid = 0;
  product: ProductDto;
  totalRecords: number = 0;
  currentPage: number = 1;
  productCustCodeSearch = '';
  productSizeSearch = '';
  productDateSearch = '';
  lang = 'en';
  subtotal: number;
  indicatorButton = false;

  lblSelectadate: string;
  SharedService: any;
  minDate = new Date(2021, 1 - 1, 1);

  displayFilePreview = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private storageService: StorageService,
    private productService: ProductService,
    private masterProductService: MasterProductService,
    private messageService: MessageService,
    private translate: TranslateService,
    private loadingService: LoadingService,
    private customerService: CustomerService,
  ) {}

  ngOnInit(): void {
    this._InitForms();
    this.getGroupLineService();
    this.lang = this.storageService.getLanguage();

    this.productsCart = this.getListProductCartLocalStorage();

    this.onSubmitFilter();
    if (this.storageService.getGrup()) {
      this.validateIDcustomer(this.storageService.getGrup());
    }
    this.translate.get('products.lblRepeatedItemMessage').subscribe((data:any)=> {
      this.repeatedItemMessage = data;
     });
     this.translate.get('checkOut.lblSelectadate').subscribe((data:any)=> {
      this.lblSelectadate = data;
     });
  }

  validateIDcustomer(customerId: string): void {
    this.getCustomerShowPrice(customerId);
  }

  _InitForms() {
    this.SearchFormAllProduct = this.formBuilder.group({
      productLines_list: ['', Validators.nullValidator],
      productName: ['', Validators.nullValidator],
      customerCode: ['', Validators.nullValidator],
      size: ['', Validators.nullValidator],
      date: ['', Validators.nullValidator],
      search_product: ['', Validators.nullValidator],
    });

    for (let index = 0; index < array.length; index++) {
      int veces = myArray.Where(c => c == item).Count();
      init = "";
      for (int i = 0; i < veces; i++) init += "*";
      //    Console.WriteLine($"{item}: {init}"); 
    }










  }

  FormatD(date: string) {
    if (date) {
      date = date.replace('.', '');
      return date.substr(0, 3) + date.charAt(3).toUpperCase() + date.substr(4);
    }
    return '';
  }

  paginate(event: { page: number; rows: number }) {
    this.currentPage = event.page + 1;
    this.pageLenght = event.rows;
    this.onSubmitFilter();
  }

  openModalProductDetail(product: ProductDto) {
    this.product = product;
    this.productDetail.products = this.productsListTable;
    this.productDetail.getProduct(product);
    this.displayDetail = true;
  }

  openModalProductCart() {
    if (this.getListProductCartLocalStorage().length > 0) {
      this.loadingService.showDialog();
      this.shoppingCartItemsDialog.setDataCart();
    } else {
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
  }

  openModalImagen(product: any) {
    this.displayFilePreview = true;
    
  }

  addProductToCartObjet(product: any): void {
    this.selectedProductToAddToCart = product;
    if (!this.validProduct(product)) {
      this.addProductItemToCart();
    }
  }

  validProduct(product: any) {
    this.productsCart = this.getListProductCartLocalStorage();
    this.showConfirmAddItemToCart=
    this.productsCart.findIndex(
      (x) =>
        x.sizes === product.sizes &&
        x.customerProductCode === product.customerProductCode &&
        x.referenceColor === product.referenceColor
    ) > -1;

    this.repeatedItemMessage = this.repeatedItemMessage.replace("{item}", product.productName);

    return this.showConfirmAddItemToCart;
  }
  
  addProductItemToCart() {
    this.showConfirmAddItemToCart = false;
    this.productsCart.push(this.selectedProductToAddToCart);
    this.storageService.addProductLocalStorage(this.productsCart);
    this.loadingService.showDialog();
    this.shoppingCartItemsDialog.setDataCart();
  }

  addProductToCart(productid: string | number) {
    this.productsCart = this.getListProductCartLocalStorage();
    this.productsListTable
      .filter((item) => item.productId == productid)
      .forEach((product) => {
        if (!this.validProduct(product)) {
          this.productsCart.push(product);
          this.storageService.addProductLocalStorage(this.productsCart);
        }
      });
  }

  addProductCart(productid: string | number) {

    this.productsCart = this.getListProductCartLocalStorage();
    this.selectedProductToAddToCart = this.productsListTable
    .filter((item) => item.productId == productid)[0];
    
    this.selectedProductToAddToCart.quantity 
    = this.productDetail.detailForm.controls.quantity.value;

    if (this.productDetail.detailForm.valid && !this.validProduct(this.selectedProductToAddToCart)) {
      this.addProductItemToCart();
    }

    this.displayDetail = false;
    this.productDetail.detailForm.reset();
  }

  changeSubtotal(subtotal: number) {
    this.subtotal = subtotal;
  }

  openModalProductCartMultiple() {
    const that = this;
    $('input[type=checkbox]').each(function () {
      if (this.checked) {
        const productId = $(this).val();
        that.addProductToCart(productId);
      }
    });

    $('input[type="checkbox"]').prop('checked', false);
    this.checkIfActive(null);
    this.loadingService.showDialog();
    this.shoppingCartItemsDialog.setDataCart();
  }

  public selectEventCustCode(item: string) {
    this.productCustCodeSearch = item;
  }

  public clearEventCustCode() {
    this.productCustCodeSearch = '';
  }

  public inputChangedEventCustCode(value: string) {
    this.productCustCodeSearch = value;
  }

  public selectEventSize(item: string) {
    this.productSizeSearch = item;
  }

  public clearEventSize() {
    this.productSizeSearch = '';
  }

  public inputChangedEventSize(value: string) {
    this.productSizeSearch = value;
  }

  public selectEventDate(item: string) {
    this.productDateSearch = item;
  }

  public clearEventDate() {
    this.productDateSearch = '';
  }

  public inputChangedEventDate(value: string) {
    this.productDateSearch = value;
  }

  public showPanelFilter() {
    this.showfilters = !this.showfilters;
  }

  get formSearch() {
    return this.SearchFormAllProduct.controls;
  }

  checkIfActive(evt) {
    this.enableMultiple = false;
    const that = this;
    $('input[type=checkbox]').each(function () {
      if (this.checked) {
        that.enableMultiple = true;
      }
    });
    $('input').closest('.shopping-cart').css('border', '2px solid #54585a26');
    $('input:checked')
      .closest('.shopping-cart')
      .css('border', '2px solid #D6001C4D');
  }

  resetFields() {
    this.SearchFormAllProduct.reset();
  }

  getGroupLineService(): void {
    this.masterProductService.getGroupLine().subscribe(
      (response) => {
        if (response.status) {
          this.productLinesFilter = response.data;
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

  closeDetailWindow() {
    this.displayDetail = false;
  }

  onSubmitFilter(): void {
    moment.locale(this.storageService.getLanguage());
    let formatOne = '';
    if (this.storageService.getLanguage() == 'es') {
      formatOne = 'DD/MMM/YYYY';
    } else {
      formatOne = 'MMM/DD/YYYY';
    }
    const form = {
      page: this.currentPage,
      limit: this.pageLenght,
      orderBy: 'productId',
      ordAscendingerBy: true,
      lineId: this.formSearch.productLines_list.value
        ? this.formSearch.productLines_list.value
        : 0,
      productName: this.formSearch.productName.value,
      customerProductCode: this.formSearch.customerCode.value,
      sizes: this.formSearch.size.value,
      brandCatalogId: 0,
      customerId:
        this.storageService.getGrup() == null
          ? null
          : this.storageService.getGrup(),
      creationDate: this.formSearch.date.value
        ? moment(this.formSearch.date.value, formatOne).format('YYYY-MM-DD')
        : null,
    };
    this.indicatorButton = true;
    this.productService.GetProductsFiltered(form).subscribe(
      (response) => {
        if (response) {
          this.productsListTable = response.data;
          this.totalRecords = response.quantity;
        } else {
          this.productsListTable = [];
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

  onSubmitFilterSearch(data: string) {
    const formDataFilterSearch = {
      "page": this.currentPage,
      "limit": this.pageLenght,
      "orderBy": "productId",
      "ordAscendingerBy": true,
      "ProductNameCode":data,
      "customerId":this.storageService.getGrup()
    };
    if (formDataFilterSearch.ProductNameCode != '') {
      this.productService
        .GetProductsFiltereCodeName(formDataFilterSearch)
        .subscribe(
          (response) => {
            if (response) {
              this.productsListTable = response.data;
              this.totalRecords = response.quantity;
            } else {
              this.productsListTable = [];
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
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          },
          () => {}
        );
    } else {
      this.onSubmitFilter();
    }
  }

  getCustomerShowPrice(customerId: string) {
    const body = { customerId };
    this.customerService.getCustomersById(body).subscribe(
      (response) => {
        this.shoppingCartItemsDialog.dataCustomer(response.data);
        this.storageService.addShowPrice(response.data);
      }
    );
  }

  getListProductCartLocalStorage(): any[] {
    return (this.productsCart =
      this.storageService.getProductLocalStorage() == null
        ? []
        : this.storageService.getProductLocalStorage());
  }
}

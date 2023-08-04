import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BrandService } from 'src/app/core/services/brand/brand.service';
import { MasterProductService } from 'src/app/core/services/masterProduct/master-product.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { CustomerType } from 'src/app/shared/constant/customertype.enum';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { BrandProductDto } from 'src/app/shared/models/brandproducto-dto';
import { FileUpload } from 'src/app/shared/models/fileUpload';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { CommonMastersService } from 'src/app/core/services/common-masters/common-masters.service';

declare var $: any;

@Component({
  selector: 'app-brand-products-new',
  templateUrl: './brand-products-new.component.html',
  styleUrls: ['./brand-products-new.component.css'],
  providers: [MessageService],
})
export class BrandProductsNewComponent implements OnInit {
  @ViewChild('ngForm') ngForm: FormGroupDirective;
  product: BrandProductDto;
  lang = 'en';
  displayFilePreview: boolean = false;
  eCustomerType = CustomerType;
  customerTypeId: any = '2';
  indicatorButton = false;
  totalRecordsPricing: number = 0;
  currentPagePricing: number = 1;
  pageLenghtPricing = environment.pageLenght;
  brandProductPricing = [];
  totalRecordsDetail: number = 0;
  currentPageDetail: number = 1;
  hideErrorType: boolean;
  hideErrorSize: boolean;
  displayConfirmCreate: boolean;
  maxSize: string;
  displayInvalidateFileMessage: boolean;
  brandProductDetails = [];
  brandCustomers = [];
  fileList: FileUpload[] = new Array<FileUpload>();
  DaysWeeks = [];
  ExFactoryLocations = [];
  Status = [];
  productLines = [];
  buttonState = false;
  pageLenghtDetail = environment.pageLenght;
  form: FormGroup;
  internalCodeProduct: string = '';
  displayComment: boolean = false;
  addBrandProductForm: FormGroup;
  addBrandProductPriceForm: FormGroup;
  ListCompany = [];
  ListDetails = [];

  listBrandProductRangePrice = [];
  listPackageUnit = [];
  listCurrencies = [];
  displayPriceComment = false;
  rowDelete: number = 0;
  rowPriceDelete: number = 0;
  showModalDelete: boolean = false;
  showModalPriceDelete: boolean = false;

  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.AllProducts', url: '/home/all_product' },
    { label: 'product-brand.lblProductsByBrand', url: '/home/brandProducts' },
    {
      label: 'product-brand-new.titleMain',
      url: '/home/brandProductsNew',
      current: true,
    },
  ];

  settingsLastestVersion = {
    minDate: new Date(2021, 1 - 1, 1),
    required: true,
    dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['LastestVersion'],
    labels: 'product-brand-detail.lblLastestVersion',
  };
  settingsApprovedDate = {
    minDate: new Date(2021, 1 - 1, 1),
    required: false,
    dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['ApprovedDate'],
    labels: 'product-brand-detail.lblApprovedDate',
  };
  allowedFileTypes = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/bmp',
    'image/tiff',
  ];

  allowedDetailFileTypes = ['application/pdf'];
  submitted: Boolean;
  brandNew: any;
  file: any;
  customerCode = '';

  constructor(
    private messageService: MessageService,
    private brandService: BrandService,
    private sharedService: SharedService,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private masterProductService: MasterProductService,
    private commonMastersService: CommonMastersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.lang = this.storageService.getLanguage();
    this.customerTypeId = this.storageService.getUserType();
    this._InitForms();
    this.serviceBrandCustomers();
    this.getStatusFilter();
    this.getTimeUnit();
    this.getFactoryLocation();
    this.getGroupLineService();
    this.getAllBrandCatalogRange();
    this.getAllPackageUnitFromUnitMeasure();
    this.getCurrencies();
    const that = this;
    $(function () {
      that.configUploadFiles();
    });
    this.getBrandProductForm();
    this.getBrandProductPriceForm();
    this.getCompanyService();
  }

  getGroupLineService(): void {
    this.masterProductService.getGroupLine().subscribe(
      (response) => {
        if (response.status) {
          this.productLines = response.data;
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
      () => { }
    );
  }

  getAllBrandCatalogRange() {
    this.brandService.getAllBrandCatalogRange().subscribe(
      (response) => {
        this.listBrandProductRangePrice = response.data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => { }
    );
  }

  getAllPackageUnitFromUnitMeasure() {
    this.commonMastersService.getAllPackageUnitFromUnitMeasure().subscribe(
      (response) => {
        this.listPackageUnit = response.data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => { }
    );
  }

  getCurrencies() {
    this.sharedService.getCurrencies().subscribe(
      (response) => {
        this.listCurrencies = response.data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => { }
    );
  }

  getTimeUnit() {
    const data = {};
    this.brandService.getTimeUnit(data).subscribe(
      (response) => {
        this.DaysWeeks = response.data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => { }
    );
  }

  getFactoryLocation() {
    const data = {};
    this.brandService.getFactoryLocation(data).subscribe(
      (response) => {
        this.ExFactoryLocations = response.data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => { }
    );
  }

  getStatusFilter() {
    this.brandService.getAllStatus().subscribe(
      (response) => {
        this.Status = response.data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => { }
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
      () => { }
    );
  }

  accept() {
    this.displayConfirmCreate = false;

    const ProductionLine = this.productLines.filter(
      (e) => e.groupLineId === this.formControls.ProductionLine.value
    )[0];
    const TimeUnit = this.DaysWeeks.filter(
      (e) => e.timeUnitId === this.formControls.DaysWeeks.value
    )[0];
    const ExFactoryLocation = this.ExFactoryLocations.filter(
      (e) => e.factoryLocationId === this.formControls.ExFactoryLocation.value
    )[0];
    const Status = this.Status.filter(
      (e) => e.brandCatalogStatusId === this.formControls.Status.value
    )[0];
    const brandCustomer = this.brandCustomers.filter(
      (e) => e.masterCustomerId === this.formControls.BrandCustomer.value
    )[0];

    this.brandNew.productType = ProductionLine.groupLineName;
    this.brandNew.timeUnitName = TimeUnit.name;
    this.brandNew.factoryLocationName = ExFactoryLocation.factoryLocationName;
    this.brandNew.status = Status.brandCatalogStatusName;
    this.brandNew.brandCustomerName = brandCustomer.masterCustomerName;
    this.storageService.addProductBrand(this.brandNew);
    this.router.navigate(['home/brandProductsDetail']);
  }

  configUploadFiles() {
    let jQueryInstance = this;

    $('input[id^=file]').hide();

    $('#artFile').click(function () {
      $(this).prev('input').click();
    });

    $('#artFileAditional').click(function () {
      $(this).prev('input').click();
    });

    $('#txtUploadArtFile').on('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    $('#txtUploadArtFile').on('dragenter', function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    $('#txtUploadArtFile').on('drop', function (e) {
      if (e.originalEvent.dataTransfer) {
        if (e.originalEvent.dataTransfer.files.length) {
          e.preventDefault();
          e.stopPropagation();
          /*UPLOAD FILES HERE*/
          let file = e.originalEvent.dataTransfer.files[0];
          let fileName = file.name;
          let isMain = true; //Main file of Brand.
          jQueryInstance.upload(
            fileName,
            file,
            isMain,
            this.allowedFileTypes,
            false
          );
        }
      }
    });

    $('#txtUploadAditional').on('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    $('#txtUploadAditional').on('dragenter', function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    $('#txtUploadAditional').on('drop', function (e) {
      if (e.originalEvent.dataTransfer) {
        if (e.originalEvent.dataTransfer.files.length) {
          e.preventDefault();
          e.stopPropagation();
          /*UPLOAD FILES HERE*/
          let file = e.originalEvent.dataTransfer.files[0];
          let fileName = file.name;
          let isMain = false; //Main file of Brand.
          jQueryInstance.upload(
            fileName,
            file,
            isMain,
            this.allowedDetailFileTypes,
            false
          );
        }
      }
    });
  }

  async upload(
    fileName: string,
    fileContent: any,
    isMain: any,
    validator: string[],
    isDesigner: boolean
  ) {
    if (await this.validateUploadedFile(fileContent, validator)) {
      await this.convertFileToBase64(fileContent, isMain, isDesigner);
    }
  }

  async validateUploadedFile(fileContent: any, validator: string[]) {
    this.hideErrorType = true;
    this.hideErrorSize = true;
    this.displayInvalidateFileMessage = false;

    this.maxSize = environment.max_file_size + 'MB';
    if (validator.indexOf(fileContent.type) == -1) {
      this.hideErrorType = false;
    }
    if (
      fileContent.size > environment.max_file_size * 1000000 ||
      fileContent.size == 0
    ) {
      this.hideErrorSize = false;
    }
    this.displayInvalidateFileMessage =
      !this.hideErrorSize || !this.hideErrorType;
    return !this.displayInvalidateFileMessage;
  }

  async convertFileToBase64(file, isMain, isDesigner) {
    var self = this;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      let fileFU: FileUpload = {
        fileName: file.name,
        fileType: file.type,
        isMain: isMain,
        fileUrl: 'Finotex',
        fileTemporal: reader.result.toString().split(',')[1],
        IsDesignerFile: isDesigner,
        fileDataType: 'string',
      };

      self.fileList.push(fileFU);
      self.updateFileList(isMain, isDesigner);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  updateFileList(isMain: boolean, isDesigner: boolean) {
    let filesUpload: string = '';
    this.fileList.forEach((item, index) => {
      if (item.isMain == isMain) {
        filesUpload += item.fileName + ' ';
      }
    });
    if (isMain) {
      this.formControls.UploadArtFile.setValue(filesUpload);
    } else {
      this.formControls.UploadAditional.setValue(filesUpload);
    }
  }

  private _InitForms() {
    this.form = this.formBuilder.group({
      BrandCustomer: ['', Validators.nullValidator],
      CustomerCode: [null, [Validators.required]],
      LastestVersion: [null, [Validators.required]],
      Description: [null, [Validators.required]],
      Dimentions: [null, [Validators.required]],
      FinalDimentions: [null, [Validators.required]],
      ProductionLine: [null, [Validators.required]],
      MinimunOrderQuantity: [null, [Validators.maxLength(6)]],
      MinumumPerSku: [null, []],
      LeadTime: [null, [Validators.required, Validators.maxLength(2)]],
      DaysWeeks: ['', [Validators.required]],
      ExFactoryLocation: [null, [Validators.required]],
      ProductionFacilites: [null, [Validators.required]],
      Status: [null, [Validators.required]],
      ApprovedBy: [null, [Validators.maxLength(100)]],
      ApprovedDate: [null, []],
      ConstructionDetail: [null, [Validators.required]],
      Comments: [null, [Validators.maxLength(250)]],
      UploadArtFile: [null, []],
      UploadAditional: [null, []],
    });
  }

  IsValid(control: string): boolean {
    return this.form.get(control).valid;
  }

  get formControls() {
    return this.form.controls;
  }

  createBrandProduct() {
    this.submitted = true;
    const brandProduct = {
      masterCustomerId: this.formControls.BrandCustomer.value,
      brandCatalogCode: this.formControls.CustomerCode.value,
      brandCatalogName: this.formControls.Description.value,
      groupLineId: this.formControls.ProductionLine.value,
      latestVersion: this.fixDate(this.formControls.LastestVersion.value),
      dimension: this.formControls.Dimentions.value,
      finalDimension: this.formControls.FinalDimentions.value,
      moq: this.formControls.MinimunOrderQuantity.value,
      minimunPerChange: this.formControls.MinumumPerSku.value,
      leadTime: this.formControls.LeadTime.value,
      leadTimeUnit: this.formControls.DaysWeeks.value,
      factoryLocationId: this.formControls.ExFactoryLocation.value,
      localFacility: this.formControls.ProductionFacilites.value,
      brandCatalogStatusId: this.formControls.Status.value,
      approvedBy: this.formControls.ApprovedBy.value,
      approvedDate: this.formControls.ApprovedDate.value
        ? this.fixDate(this.formControls.ApprovedDate.value)
        : null,
      constructionDetail: this.formControls.ConstructionDetail.value,
      comments: this.formControls.Comments.value,
      imageUrl: '',
      adobeUrl: '',
      brandCatalogFiles: this.fileList,
      brandCatalogProduct: this.ListDetails,
      brandCatalogPrice: this.brandProductPricing,
    };
    this.buttonState = true;
    this.brandService.createBrandCatalog(brandProduct).subscribe(
      (response) => {
        if (response.status) {
          this.brandNew = response.data;
          this.customerCode = this.brandNew.brandCatalogCode;
          this.displayConfirmCreate = true;
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
        this.buttonState = false;
      },
      () => {
        this.buttonState = false;
      }
    );
  }

  createDetailsBrandProduct() {
    this.closePanelDialog();
    let companyId = this.addBrandProductForm.get('Company').value;
    const pr = this.ListCompany.filter((x) => x.businessId == companyId);
    const newDetails = {
      itemReference: this.addBrandProductForm.get('itemReference').value,
      companyId: this.addBrandProductForm.get('Company').value,
      company: pr[0].name,
      productId: this.addBrandProductForm.get('internalProductCode').value,
      size: this.addBrandProductForm.get('size').value,
      color: this.addBrandProductForm.get('color').value,
    };
    this.ListDetails.push(newDetails);
    this.displayComment = false;
  }

  createBrandProductPrice(): void {
    const brandCustomer = this.brandCustomers.filter(
      (e) => e.masterCustomerId === this.formControls.BrandCustomer.value
    )[0];
    const currency = this.listCurrencies.filter(
      (e) => e.currencyId === brandCustomer.currencyId
    )[0];
    const salesUnit = this.listPackageUnit.filter(
      (e) => e.unitMeasureId === this.addBrandProductPriceForm.controls.salesUnit.value
    )[0];
    this.addBrandProductPriceForm.controls.currencyId.setValue(
      brandCustomer.currencyId
    );
    this.addBrandProductPriceForm.controls.salesUnitName.setValue(salesUnit.unitMeasureName);
    this.addBrandProductPriceForm.controls.centsName.setValue(currency.centsName);
    this.brandProductPricing.push(this.addBrandProductPriceForm.value);
    this.displayPriceComment = false;
  }

  onChangeRange($event) {
    if (this.addBrandProductPriceForm.controls.brandCatalogRangeId) {
      this.addBrandProductPriceForm.controls.salePrice.enable();
      const range = this.listBrandProductRangePrice.filter(
        (e) =>
          e.brandCatalogRangeId ===
          this.addBrandProductPriceForm.controls.brandCatalogRangeId.value
      )[0];
      const rangePrev = this.listBrandProductRangePrice.filter(
        (e) =>
          e.brandCatalogRangeId ===
          this.addBrandProductPriceForm.controls.brandCatalogRangeId.value - 1
      )[0];
      this.addBrandProductPriceForm.controls.brandCatalogRangeInitial.setValue(
        rangePrev ? rangePrev.brandCatalogTopRange + 1 : 1
      );
      this.addBrandProductPriceForm.controls.brandCatalogRangeFinal.setValue(
        range.brandCatalogTopRange
      );
    }
  }

  onChangeQuantity($event) {
    if (this.addBrandProductPriceForm.controls.brandCatalogRangeId) {
      const range = this.listBrandProductRangePrice.filter(
        (e) =>
          e.brandCatalogRangeId ===
          this.addBrandProductPriceForm.controls.brandCatalogRangeId.value
      )[0];
      const rangePrev = this.listBrandProductRangePrice.filter(
        (e) =>
          e.brandCatalogRangeId ===
          this.addBrandProductPriceForm.controls.brandCatalogRangeId.value - 1
      )[0];
      if (
        range.brandCatalogTopRange.value <
        this.addBrandProductPriceForm.controls.salePrice.value ||
        rangePrev.brandCatalogTopRange + 1 >
        this.addBrandProductPriceForm.controls.salePrice.value
      ) {
        this.addBrandProductPriceForm.controls.salePrice.setValue(0);
      } else {
        let salePrice = this.addBrandProductPriceForm.controls.salePrice.value;
        this.addBrandProductPriceForm.controls.fobprice.setValue(salePrice);
        this.addBrandProductPriceForm.controls.intercompanyPrice.setValue(
          salePrice
        );
      }
    }
  }

  fixDate(date: string) {
    moment.locale(this.storageService.getLanguage());
    return moment(date, 'MMM/DD/YYYY').format('YYYY-MM-DD');
  }

  onKeyPressNumber(event) {
    return /[0-9]/.test(String.fromCharCode(event.which));
  }

  get showBrandCustomer() {
    return this.customerTypeId == this.eCustomerType.BrandCustomer;
  }

  FormatD(date: string) {
    if (date) {
      date = date.replace('.', '');
      return date.substr(0, 3) + date.charAt(3).toUpperCase() + date.substr(4);
    }
    return '';
  }

  public resetFiles(isMain: string) {
    if (isMain == 'file') {
      this.formControls.UploadArtFile.setValue('');
    } else {
      this.formControls.UploadAditional.setValue('');
    }

    this.fileList.forEach((item, index) => {
      if (isMain == 'file') {
        if (item.isMain) {
          delete this.fileList[index];
        }
      }

      if (isMain == 'addFile') {
        if (!item.isMain) {
          delete this.fileList[index];
        }
      }
    });
  }

  async fileChanged(e) {
    this.file = e.target.files[0];
    let isMain = true; //Main file of Skecth.
    await this.upload(
      this.file.name,
      this.file,
      isMain,
      this.allowedFileTypes,
      false
    );
  }

  async fileChangedAditional(e) {
    this.file = e.target.files[0];
    let isMain = false; //Aditional file of Skecth.
    await this.upload(
      this.file.name,
      this.file,
      isMain,
      this.allowedDetailFileTypes,
      false
    );
  }

  getBrandProductForm() {
    this.addBrandProductForm = this.formBuilder.group({
      itemReference: { value: null, disabled: true },
      internalProductCode: ['', Validators.required],
      size: ['', Validators.nullValidator],
      color: ['', Validators.nullValidator],
      Company: ['', Validators.required],
    });
    return this.addBrandProductForm;
  }

  getBrandProductPriceForm() {
    this.addBrandProductPriceForm = this.formBuilder.group({
      brandCatalogRangeId: [null, Validators.required],
      brandCatalogRangeInitial: [null, Validators.nullValidator],
      brandCatalogRangeFinal: [null, Validators.nullValidator],
      salePrice: [{ value: null, disabled: true }, Validators.required],
      fobprice: [null, Validators.required],
      intercompanyPrice: [null, Validators.required],
      salesUnit: [null, Validators.required],
      salesUnitName: [null, Validators.nullValidator],
      currencyId: [null, Validators.nullValidator],
      centsName: [null, Validators.nullValidator],
      edit: [false, Validators.nullValidator],
    });
    return this.addBrandProductForm;
  }

  removePrice(i: number) {
    this.rowPriceDelete = i;
    this.showModalPriceDelete = true;
  }

  acceptDeletePriceRow() {
    this.brandProductPricing.splice(this.rowPriceDelete, 1);
    this.showModalPriceDelete = false;
  }

  showPanelDialog() {
    document.body.style.overflow = 'hidden';
    this.displayComment = true;
    this.addBrandProductForm.reset();
    this.addBrandProductForm.patchValue({
      itemReference: this.form.get('CustomerCode').value,
    });
  }

  getCompanyService() {
    this.sharedService.getCompany().subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.ListCompany = response.data;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
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
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => { }
    );
  }

  onFocusOutEvent(event: any) {
    if (!this.addBrandProductForm.valid) {
      return;
    }
    if (event.target.value.trim().toUpperCase() != '') {
      this.addBrandProductForm.patchValue({
        internalProductCode: event.target.value,
      });

      const ipc = this.addBrandProductForm.get('internalProductCode').value;
      const companyId = this.addBrandProductForm.get('Company').value;
      if (!this.addBrandProductForm.valid) {
        return;
      } else {
        const ProductionLine = this.ListDetails.filter(
          (e) =>
            e.productId.trim().toUpperCase() ===
            event.target.value.trim().toUpperCase() &&
            e.companyId === companyId
        )[0];
        if (ProductionLine != null || ProductionLine != undefined) {
          this.translate
            .stream('product-brand-edit.lblAlertExisting')
            .subscribe((res: string) => {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: res,
              });
            });

          this.addBrandProductForm.patchValue({
            internalProductCode: '',
          });

          return;
        }
      }

      const body = { productId: ipc, companyId: companyId };
      this.brandService.getInternalProductCode(body).subscribe(
        (response) => {
          if (response) {
            if (response.status) {
              this.addBrandProductForm
                .get('internalProductCode')
                .updateValueAndValidity();
            } else {
              this.addBrandProductForm
                .get('internalProductCode')
                .setValidators([Validators.required, Validators.minLength(5)]);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.message,
              });
            }
          } else {
            this.addBrandProductForm.patchValue({
              internalProductCode: '',
            });
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
          this.buttonState = false;
        },
        () => {
          this.buttonState = false;
        }
      );
    }
  }

  remove(i: number) {
    this.rowDelete = i;
    this.showModalDelete = true;
  }

  acceptDeleteRow() {
    this.ListDetails.splice(this.rowDelete, 1);
    this.showModalDelete = false;
  }

  closePanelDialog() {
    document.body.style.overflow = 'auto';
    this.displayComment = false;
  }

  closePanelPriceDialog() {
    document.body.style.overflow = 'auto';
    this.displayPriceComment = false;
  }

  isValidateForm() {
    return (this.form.invalid || this.buttonState || (this.brandProductPricing.length == 0));
  }
}

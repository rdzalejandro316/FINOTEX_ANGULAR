import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BrandService } from 'src/app/core/services/brand/brand.service';
import { MasterProductService } from 'src/app/core/services/masterProduct/master-product.service';
import { ProfilesService } from 'src/app/core/services/profile/profiles.service';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { CustomerType } from 'src/app/shared/constant/customertype.enum';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { BrandProductDto } from 'src/app/shared/models/brandproducto-dto';
import { FileUpload } from 'src/app/shared/models/fileUpload';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { CommonMastersService } from 'src/app/core/services/common-masters/common-masters.service';

declare var $: any;

@Component({
  selector: 'app-brand-products-edit',
  templateUrl: './brand-products-edit.component.html',
  styleUrls: ['./brand-products-edit.component.css'],
  providers: [MessageService, DatePipe],
})
export class BrandProductsEditComponent implements OnInit {
  @ViewChild('ngForm') ngForm: FormGroupDirective;

  brandProductEdit: FormGroup;
  product: BrandProductDto;
  detailsProductBrand: any;
  lang = 'en';
  displayFilePreview: boolean = false;
  eCustomerType = CustomerType;
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
  displayComment: boolean = false;
  editBrandProductForm: FormGroup;
  ListCompany = [];
  ListDetails = [];
  listBrandProductRangePrice = [];
  internalCodeProduct: string = '';
  rowDelete: number = 0;
  showModalDelete: boolean = false;
  selectRowDelete: any = {};
  isEditDetails: boolean = false;
  currencyCode: string = '';
  imageGaleryBrandEdit = "";

  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.AllProducts', url: '/home/all_product' },
    { label: 'product-brand.lblProductsByBrand', url: '/home/brandProducts' },
    {
      label: 'Edit brand product',
      url: '/home/brandProductsEdit',
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
  brandNew: any = {};
  file: any;
  fileArt: any;
  customerCode = '';
  listPackageUnit = [];
  listCurrencies = [];
  createEditEnabled: boolean = true;

  constructor(
    private messageService: MessageService,
    public translate: TranslateService,
    private readonly sharedService: SharedService,
    private brandService: BrandService,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private masterProductService: MasterProductService,
    private profilesService: ProfilesService,
    private commonMastersService: CommonMastersService,
    public datepipe: DatePipe,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.lang = this.storageService.getLanguage();
    moment.locale(this.storageService.getLanguage());
    this.configUploadFiles();
    this.initForms();
    this.serviceBrandCustomers();
    this.getStatusFilter();
    this.getTimeUnit();
    this.getFactoryLocation();
    this.getGroupLineService();
    this.product = this.storageService.getProductBrand();
    this.setDataEditBrand();
    this.getListCompany();
    this.getBrandProductForm();
    this.getListData();
    this.getListPricingData();
    this.getAllBrandCatalogRange();
    this.validateEnabledPricing(this.controls.Status.value);
    this.getCurrencies();
    this.getAllPackageUnitFromUnitMeasure();
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

  getListData() {
    let datos = {
      brandCatalogId: this.product.brandCatalogId,
    };

    this.brandService.getBrandCatalogProduct(datos).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.brandProductDetails = response.data;
            this.totalRecordsDetail = response.quantity;
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
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      }
    );
  }

  get preciFormCall() {
    return this.brandProductEdit.get('preci') as FormArray;
  }

  addPreci(): void {
    const brandCustomer = this.brandCustomers.filter(
      (e) => e.masterCustomerId === this.brandProductEdit.get('BrandCustomer').value
    )[0];

    const currency = this.listCurrencies.filter(
      (e) => e.currencyId === brandCustomer.currencyId
    )[0];

    this.preciFormCall.push(this.itemPreci({
      currencyId: currency.currencyId,
      centsName: currency.centsName,
      currencyName: currency.currencyName,
      currencySymbol: currency.currencySymbol,
      brandCatalogId: this.product.brandCatalogId
    }));
  }

  getListPricingData() {
    let datos = {
      brandCatalogId: this.product.brandCatalogId,
    };
    this.brandService.getBrandCatalogPrices(datos).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            response.data.forEach((_element, _index) => {
              this.preciFormCall.push(this.itemPreci(_element));
              this.currencyCode = this.preciFormCall
                .at(_index)
                .get('centsName').value;
            });
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
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      }
    );
  }

  getBrandProductForm() {
    this.editBrandProductForm = this.formBuilder.group({
      itemReference: { value: null, disabled: true },
      internalProductCode: ['', Validators.required],
      size: ['', Validators.nullValidator],
      color: ['', Validators.nullValidator],
      Company: ['', Validators.required],
    });
    return this.editBrandProductForm;
  }

  getListCompany() {
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

  showPanelDialogEdit(productDetail: any) {
    this.isEditDetails = true;
    document.body.style.overflow = 'hidden';
    this.selectRowDelete = productDetail;
    this.displayComment = true;
    this.internalCodeProduct = productDetail.productId;
    this.editBrandProductForm.patchValue({
      itemReference: this.product.brandCatalogCode,
      internalProductCode: productDetail.productId.trim(),
      size: productDetail.size,
      color: productDetail.color,
      Company: productDetail.companyId,
    });
  }

  showPanelDialog() {
    this.isEditDetails = false;
    this.selectRowDelete = {};
    document.body.style.overflow = 'hidden';
    this.displayComment = true;
    this.editBrandProductForm.reset();
    this.editBrandProductForm.patchValue({
      itemReference: this.product.brandCatalogCode,
    });
  }

  closePanelDialog() {
    document.body.style.overflow = 'auto';
    this.displayComment = false;
  }

  changeCompany() {
    this.editBrandProductForm.patchValue({
      internalProductCode: '',
    });
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
    const statusName = this.Status.filter(
      (e) => e.brandCatalogStatusId === this.controls.Status.value
    )[0].brandCatalogStatusName;
    const daysWeeksName = this.DaysWeeks.filter(
      (e) => e.timeUnitId === this.controls.DaysWeeks.value
    )[0].name;

    this.displayConfirmCreate = false;
    this.brandNew.timeUnitName = daysWeeksName;
    this.brandNew.status = statusName;
    this.brandNew.imageUrlTmp = this.product.imageUrlTmp;
    this.brandNew.adobeUrlTmp = this.product.adobeUrlTmp;
    this.storageService.addProductBrand(this.brandNew);
    this.router.navigate(['home/brandProductsDetail']);
  }

  async upload(
    fileName: string,
    fileContent: any,
    isMain: any,
    validator: string[]
  ) {
    if (await this.validateUploadedFile(fileContent, validator)) {
      await this.convertFileToBase64(fileContent, isMain);
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

  async convertFileToBase64(file, isMain) {
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
        IsDesignerFile: false,
        fileDataType: 'string',
      };
      if (isMain) {
        self.resetFiles('file');
        self.product.imageUrlTmp =
          'data:image/jpeg;base64,' + fileFU.fileTemporal;
      } else {
        self.resetFiles('addFile');
        self.product.adobeUrlTmp =
          'data:image/jpeg;base64,' + fileFU.fileTemporal;
      }
      self.fileList.push(fileFU);

      self.updateFileList(isMain);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  updateFileList(isMain: boolean) {
    let filesUpload: string = '';
    this.fileList.forEach((item, index) => {
      if (item.isMain == isMain) {
        filesUpload += item.fileName + ' ';
      }
    });
    if (isMain) {
      this.brandProductEdit.controls.UploadArtFile.setValue(filesUpload);
    } else {
      this.brandProductEdit.controls.UploadAditional.setValue(filesUpload);
    }
  }

  private initForms() {
    return (this.brandProductEdit = this.formBuilder.group({
      brandCatalogId: ['', Validators.nullValidator],
      BrandCustomer: ['', Validators.nullValidator],
      CustomerCode: ['', [Validators.required]],
      LastestVersion: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      Dimentions: ['', [Validators.required]],
      FinalDimentions: ['', [Validators.required]],
      ProductionLine: ['', [Validators.required]],
      MinimunOrderQuantity: ['', [Validators.nullValidator]],
      MinumumPerSku: ['', [Validators.nullValidator]],
      LeadTime: ['', [Validators.required]],
      DaysWeeks: ['', [Validators.required]],
      ExFactoryLocation: ['', [Validators.required]],
      ProductionFacilites: ['', [Validators.required]],
      Status: ['', [Validators.required]],
      ApprovedBy: ['', [Validators.nullValidator]],
      ApprovedDate: ['', [Validators.nullValidator]],
      ConstructionDetail: ['', [Validators.required]],
      Comments: ['', [Validators.nullValidator]],
      UploadArtFile: ['', [Validators.nullValidator]],
      UploadAditional: ['', [Validators.nullValidator]],
      preci: this.formBuilder.array([], this.itemPreci({})),
    }));
  }

  private itemPreci(data: any): FormGroup {
    return this.formBuilder.group({
      brandCatalogId: [data.brandCatalogId, Validators.nullValidator],
      brandCatalogRangeId: [data.brandCatalogRangeId, [Validators.required]],
      brandCatalogRangeInitial: [
        data.brandCatalogRangeInitial,
        [Validators.nullValidator],
      ],
      brandCatalogRangeFinal: [
        data.brandCatalogRangeFinal,
        [Validators.nullValidator],
      ],
      salePrice: [data.salePrice, [Validators.required]],
      fobprice: [data.fobprice, [Validators.required]],
      intercompanyPrice: [data.intercompanyPrice, [Validators.required]],
      salesUnit: [data.salesUnit, [Validators.required]],
      currencyId: [data.currencyId, [Validators.nullValidator]],
      currencyName: [data.currencyName, [Validators.nullValidator]],
      currencySymbol: [data.currencySymbol, [Validators.nullValidator]],
      centsName: [data.centsName, [Validators.nullValidator]],
      isEdit: [false, [Validators.nullValidator]],
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

  get showBrandCustomer() {
    return !this.profilesService.validateUserType();
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
      this.brandProductEdit.controls.UploadArtFile.setValue('');
    } else {
      this.brandProductEdit.controls.UploadAditional.setValue('');
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
    let isMain = true;
    await this.upload(this.file.name, this.file, isMain, this.allowedFileTypes);
  }

  async fileChangedAditional(e) {
    this.file = e.target.files[0];
    let isMain = false;
    await this.upload(
      this.file.name,
      this.file,
      isMain,
      this.allowedDetailFileTypes
    );
  }

  clickArtFile() {
    $('#fileArtFile').click();
  }

  clickArtFileAditional() {
    $('#fileArtFileAditional').click();
  }

  configUploadFiles() {
    let jQueryInstance = this;
    $('input[id^=file]').hide();

    $('#artFileDesigner').click(function () {
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
          let isMain = true; //Main file of Skecth.
          jQueryInstance.upload(fileName, file, isMain, this.allowedFileTypes);
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
          let file = e.originalEvent.dataTransfer.files[0];
          let fileName = file.name;
          let isMain = false;
          jQueryInstance.upload(
            fileName,
            file,
            isMain,
            this.allowedDetailFileTypes
          );
        }
      }
    });
  }

  openPreviewFile(imgUrl: string) {
    this.displayFilePreview = true;
    this.imageGaleryBrandEdit = imgUrl;
  }

  setDataEditBrand() {
    this.brandProductEdit.patchValue({
      Dimentions: this.product.dimension,
      Status: this.product.statusId,
      FinalDimentions: this.product.finalDimension,
      ApprovedBy: this.product.approvedBy,
      Comments: this.product.comments,
      ConstructionDetail: this.product.constructionDetail,
      ProductionFacilites: this.product.localFacility,
      MinimunOrderQuantity: this.product.moq,
      CustomerCode: this.product.brandCatalogCode,
      ExFactoryLocation: this.product.factoryLocationId,
      MinumumPerSku: this.product.minimunPerChange,
      LeadTime: this.product.leadTime,
      ProductionLine: this.product.groupLineId,
      LastestVersion: this.product.latestVersion ? moment(new Date(this.product.approvedDate)).format('MMM/DD/YYYY')
        : null,
      ApprovedDate: this.product.approvedDate
        ? moment(new Date(this.product.approvedDate)).format('MMM/DD/YYYY')
        : null,
      DaysWeeks: this.product.leadTimeUnit,
      Description: this.product.brandCatalogName,
      BrandCustomer: this.product.masterCustomerId,
      brandCatalogId: this.product.brandCatalogId,
      UploadArtFile: this.product.imageUrl,
      UploadAditional: this.product.adobeUrl,
    });
  }

  formatDateTraslate(value: any) {
    let date = value;
    let dateTraslate = '';
    if (date !== undefined && date !== null) {
      if (!Number.isInteger(parseInt(date.charAt(0), 0))) {
        moment.locale('es');
        let getDateFormat = moment(date, 'MMM/DD/YYYY').format('MM/DD/YYYY');
        if (getDateFormat == 'Invalid date') {
          moment.locale('en');
          getDateFormat = moment(date, 'MMM/DD/YYYY').format('MM/DD/YYYY');
          moment.locale('es');
          dateTraslate = moment(date, 'MM/DD/YYYY').format('MM/DD/YYYY');
        } else {
          dateTraslate = date;
        }
      } else {
        //moment.locale(this.storageService.getLanguage());
        let getDateFormat = moment(date, 'YYYY-MM-DD').format('MMM/DD/YYYY');
        if (getDateFormat == 'Invalid date') {
          dateTraslate = moment(date, 'YYYY/MM/DD').format('MMM/DD/YYYY');
        } else {
          dateTraslate = getDateFormat;
        }
      }
    }

    return dateTraslate
      ? dateTraslate.charAt(0).toUpperCase() +
      dateTraslate.slice(1).replace('.', '')
      : date;
  }


  get controls() {
    return this.brandProductEdit.controls;
  }

  onChangeRange($event, index) {
    const range = this.listBrandProductRangePrice.filter((e) => e.brandCatalogRangeId === $event.value)[0];

    const rangePrev = this.listBrandProductRangePrice.filter(
      (e) =>
        e.brandCatalogRangeId === $event.value - 1
    )[0];

    this.preciFormCall.at(index).get('brandCatalogRangeInitial').setValue(
      rangePrev ? rangePrev.brandCatalogTopRange + 1 : 1
    );
    this.preciFormCall.at(index).get('brandCatalogRangeFinal').setValue(
      range.brandCatalogTopRange
    );

    this.preciFormCall.at(index).get('salesUnit').setValue(null);
    this.preciFormCall.at(index).get('salePrice').setValue(null);
    this.preciFormCall.at(index).get('fobprice').setValue(null);
    this.preciFormCall.at(index).get('intercompanyPrice').setValue(null);
  }

  onChangeStatus($event) {
    this.validateEnabledPricing($event.value);
  }

  onChangeSalesPrice($event, index) {
    if (
      this.preciFormCall.at(index).get('fobprice').value == null ||
      this.preciFormCall.at(index).get('fobprice').value == 0
    ) {
      this.preciFormCall
        .at(index)
        .get('fobprice')
        .setValue(this.preciFormCall.at(index).get('salePrice').value);
    }

    if (
      this.preciFormCall.at(index).get('intercompanyPrice').value == null ||
      this.preciFormCall.at(index).get('intercompanyPrice').value == 0
    ) {
      this.preciFormCall
        .at(index)
        .get('intercompanyPrice')
        .setValue(this.preciFormCall.at(index).get('salePrice').value);
    }
  }

  validateEnabledPricing(value) {
    this.createEditEnabled = value == 7 || value == 9;
    this.preciFormCall.controls.forEach((_element, _index) => {
      if (this.createEditEnabled) {
        this.preciFormCall.at(_index).get('brandCatalogRangeId').disable();
        this.preciFormCall.at(_index).get('salesUnit').disable();
        this.preciFormCall.at(_index).get('salePrice').disable();
        this.preciFormCall.at(_index).get('fobprice').disable();
        this.preciFormCall.at(_index).get('intercompanyPrice').disable();
      } else {
        this.preciFormCall.at(_index).get('brandCatalogRangeId').enable();
        this.preciFormCall.at(_index).get('salesUnit').enable();
        this.preciFormCall.at(_index).get('salePrice').enable();
        this.preciFormCall.at(_index).get('fobprice').enable();
        this.preciFormCall.at(_index).get('intercompanyPrice').enable();
      }
    });
  }

  onSubmitEdit(): void {
    const brandProduct = {
      brandCatalogId: this.controls.brandCatalogId.value,
      masterCustomerId: this.controls.BrandCustomer.value,
      brandCatalogCode: this.controls.CustomerCode.value,
      brandCatalogName: this.controls.Description.value,
      groupLineId: this.controls.ProductionLine.value,
      latestVersion: moment(
        this.controls.LastestVersion.value,
        'MMM/DD/YYYY'
      ).format('YYYY-MM-DD'),
      dimension: this.controls.Dimentions.value,
      finalDimension: this.controls.FinalDimentions.value,
      moq: this.controls.MinimunOrderQuantity.value,
      minimunPerChange: this.controls.MinumumPerSku.value,
      leadTime: this.controls.LeadTime.value,
      leadTimeUnit: this.controls.DaysWeeks.value,
      factoryLocationId: this.controls.ExFactoryLocation.value,
      localFacility: this.controls.ProductionFacilites.value,
      brandCatalogStatusId: this.controls.Status.value,
      approvedBy: this.controls.ApprovedBy.value,
      approvedDate: this.controls.ApprovedDate.value
        ? moment(this.controls.ApprovedDate.value, 'MMM/DD/YYYY').format(
          'YYYY-MM-DD'
        )
        : null,
      constructionDetail: this.controls.ConstructionDetail.value,
      comments: this.controls.Comments.value,
      imageUrl: this.controls.UploadArtFile.value,
      adobeUrl: this.controls.UploadAditional.value,
      brandCatalogFiles: this.fileList,
      brandCatalogProduct: this.getbrandProductDetails(this.brandProductDetails),
      brandCatalogPrice: [],
    };
    this.preciFormCall.controls.forEach((_element, _index) => {
      brandProduct.brandCatalogPrice.push({
        brandCatalogId: this.preciFormCall.at(_index).get('brandCatalogId').value,
        brandCatalogRangeId: this.preciFormCall.at(_index).get('brandCatalogRangeId').value,
        brandCatalogRangeInitial: this.preciFormCall.at(_index).get('brandCatalogRangeInitial').value,
        brandCatalogRangeFinal: this.preciFormCall.at(_index).get('brandCatalogRangeFinal').value,
        salePrice: this.preciFormCall.at(_index).get('salePrice').value,
        fobprice: this.preciFormCall.at(_index).get('fobprice').value == null ||
          this.preciFormCall.at(_index).get('fobprice').value == 0
          ? this.preciFormCall.at(_index).get('salePrice').value
          : this.preciFormCall.at(_index).get('fobprice').value,
        intercompanyPrice:
          this.preciFormCall.at(_index).get('intercompanyPrice').value ==
            null ||
            this.preciFormCall.at(_index).get('intercompanyPrice').value == 0
            ? this.preciFormCall.at(_index).get('salePrice').value
            : this.preciFormCall.at(_index).get('intercompanyPrice').value,
        salesUnit: this.preciFormCall.at(_index).get('salesUnit').value,
        currencyId: this.preciFormCall.at(_index).get('currencyId').value,
        currencyName: this.preciFormCall.at(_index).get('currencyName').value,
        currencySymbol: this.preciFormCall.at(_index).get('currencySymbol')
          .value,
        centsName: this.preciFormCall.at(_index).get('centsName').value,
      });
    });

    this.buttonState = true;
    this.brandService.updateBrandCatalog(brandProduct).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.brandNew = brandProduct;
            this.displayConfirmCreate = true;
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
        this.buttonState = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => {
        this.buttonState = false;
      }
    );
  }


  getbrandProductDetails(product: any) {
    let productDetail = [];
    for (let i = 0; i < product.length; i++) {
      productDetail.push({
        companyId: product[i].companyId,
        brandCatalogId: product[i].brandCatalogId,
        productId: product[i].productId,
        size: product[i].size,
        color: product[i].color
      })
    }
    return productDetail;
  }

  removePrice(index: any): void {
    this.preciFormCall.removeAt(index);
  }

  editSave(index: any): void {
    if (this.preciFormCall.at(index).get('salesUnit').enabled) {
      this.preciFormCall.at(index).get('brandCatalogRangeId').disable();
      this.preciFormCall.at(index).get('salesUnit').disable();
      this.preciFormCall.at(index).get('salePrice').disable();
      this.preciFormCall.at(index).get('fobprice').disable();
      this.preciFormCall.at(index).get('intercompanyPrice').disable();
    } else {
      this.preciFormCall.at(index).get('brandCatalogRangeId').enable();
      this.preciFormCall.at(index).get('salesUnit').enable();
      this.preciFormCall.at(index).get('salePrice').enable();
      this.preciFormCall.at(index).get('fobprice').enable();
      this.preciFormCall.at(index).get('intercompanyPrice').enable();
    }
    this.preciFormCall.at(index).get('salesUnit').updateValueAndValidity();
    this.preciFormCall.at(index).get('salePrice').updateValueAndValidity();
    this.preciFormCall.at(index).get('fobprice').updateValueAndValidity();
    this.preciFormCall
      .at(index)
      .get('intercompanyPrice')
      .updateValueAndValidity();
  }

  remove(i: number) {
    this.rowDelete = i;
    this.showModalDelete = true;
  }

  acceptDeleteRow() {
    this.brandProductDetails.splice(this.rowDelete, 1);
    this.showModalDelete = false;
  }

  updateDetailsBrandProduct() {
    this.closePanelDialog();
    let companyId = this.editBrandProductForm.get('Company').value;
    const pr = this.ListCompany.filter((x) => x.businessId == companyId);

    const selectRow = this.selectRowDelete;
    if (Object.entries(selectRow).length > 0) {
      for (var i = 0; i < this.brandProductDetails.length; i++) {
        if (
          this.brandProductDetails[i].productId.trim() ===
          selectRow.productId.trim() &&
          this.brandProductDetails[i].companyId === selectRow.companyId
        ) {
          this.brandProductDetails[i].companyId =
            this.editBrandProductForm.get('Company').value;
          this.brandProductDetails[i].companyName = pr[0].name;
          this.brandProductDetails[i].size =
            this.editBrandProductForm.get('size').value;
          this.brandProductDetails[i].color =
            this.editBrandProductForm.get('color').value;
          this.brandProductDetails[i].productId = this.editBrandProductForm.get(
            'internalProductCode'
          ).value;
          break;
        }
      }
    } else {
      const newDetails = {
        companyId: this.editBrandProductForm.get('Company').value,
        companyName: pr[0].name,
        size: this.editBrandProductForm.get('size').value,
        color: this.editBrandProductForm.get('color').value,
        productId: this.editBrandProductForm.get('internalProductCode').value,
      };
      this.brandProductDetails.push(newDetails);
    }

    this.displayComment = false;
    this.selectRowDelete = {};
  }

  onFocusOutEvent(event: any) {
    if (event.target.value.trim() != '') {
      this.editBrandProductForm.patchValue({
        internalProductCode: event.target.value,
      });

      const ipc = this.editBrandProductForm.get('internalProductCode').value;
      const companyId = this.editBrandProductForm.get('Company').value;

      if (!this.editBrandProductForm.valid) {
        return;
      } else {
        if (
          this.internalCodeProduct.trim().toUpperCase() !==
          event.target.value.trim().toUpperCase()
        ) {
          const ProductionLine = this.brandProductDetails.filter(
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
            this.editBrandProductForm.patchValue({
              internalProductCode: '',
            });

            return;
          }
        }
      }

      const body = { productId: ipc, companyId: companyId };
      this.brandService.getInternalProductCode(body).subscribe(
        (response) => {
          if (response) {
            if (response.status) {
              this.editBrandProductForm
                .get('internalProductCode')
                .updateValueAndValidity();
            } else {
              this.editBrandProductForm
                .get('internalProductCode')
                .setValidators([Validators.required, Validators.minLength(5)]);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.message,
              });
            }
          } else {
            this.editBrandProductForm.patchValue({
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
}

import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormGroupDirective, Validators } from '@angular/forms';
import { PqrsService } from 'src/app/core/services/pqrs/pqrs.service';
import { PqrsMastersService } from 'src/app/core/services/pqrs-masters/pqrs-masters.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { SortService } from 'src/app/core/services/sort/sort.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { SearchSelectorPrincipalComponent } from '../../../../../shared/framework-ui/custom/search-selector/search-selector.component';


declare var $: any;
@Component({
  selector: 'app-detail-request',
  templateUrl: './detail-request.component.html',
  styleUrls: ['./detail-request.component.css'],
  providers: [MessageService]
})
export class DetailRequestComponent implements OnInit {
  
  currentUserAplication: any;

  bill = [];
  expandedRows: {} = {};
  detailPqrs = [];
  detailPqrsDataForm: FormGroup;
  get detailPqrsFormCall() {
    return this.detailPqrsDataForm.get('header') as FormArray;
  }

  isNoData: boolean = true;
  totalRecords: number = 0;
  currentPage: number = 2;
  pageLenght = environment.pageLenght;


  showAddArticle = false;
  allArticleOrder = [];
  allArticleOrderDataForm: FormGroup;
  get allArticleOrderFormCall() {
    return this.allArticleOrderDataForm.get('header') as FormArray;
  }

  showQuantityHigher = false;
  showSalesPriceHigher = false;
  articleRepeat = [];
  showAddArticleFail = false;
  showOrderNotFound =  false;
  
  @ViewChild('search', { static: true }) searchSelectorComponent!: SearchSelectorPrincipalComponent;

  @Input() documentId: string;  
  @Input() requestTypeId: number = 0;
  @Input() purchaseOrderId:string;
  @Input() billDocumentId:string;
  @Input() isReadOnlyComponent: boolean = false;


  constructor(
    private readonly formBuilder: FormBuilder,
    private translate: TranslateService,
    private messageService: MessageService,
    private sortService: SortService,
    private storageService: StorageService,
    private pqrsService: PqrsService,
    private pqrsMastersService: PqrsMastersService,
  ) { }

  ngOnInit(): void {
    this._InitForms();
    this.currentUserAplication = this.storageService.getUser();
    this.getBillType();
    this.loadDetailPqrs();
  }

  blockFormsDetailPqrsFormCall()
  {      
    let controlsAll = this.detailPqrsFormCall.controls;    
    for (let index = 0; index < controlsAll.length; index++) 
    {      
      let form = controlsAll[index] as FormGroup;
      for (const ctrl in form.controls) form.get(ctrl).disable();              
    }    
  }

  _InitForms() {
    this.detailPqrsDataForm = this.formBuilder.group({
      header: this.formBuilder.array([]),
    });

    this.allArticleOrderDataForm = this.formBuilder.group({
      header: this.formBuilder.array([]),
    });
  }

  getBillType() {
    var data = {};
    this.pqrsMastersService.getBillType(data)
      .subscribe(
        (response) => {
          if (response) {
            this.bill = response.data;
          }
          else {
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
        }
      );
  }

  loadDetailPqrs() {

    var data = {
      documentId: this.documentId
    }

    this.pqrsService.getDetailPqrs(data)
      .subscribe(
        (response) => {
          if (response) {

            this.detailPqrs = response.data;
            this.totalRecords = response.quantity;
            this.isNoData = false;
            this.loadDataTable();
          }
          else {

            this.detailPqrs = [];
            this.totalRecords = 0;
            this.detailPqrsFormCall.clear();
            this.isNoData = true;          
          }
        },
        (error) => {

          this.detailPqrs = [];
          this.totalRecords = 0;
          this.detailPqrsFormCall.clear();

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        }
      );
  }

  loadDataTable() {
    this.detailPqrsFormCall.clear();
    this.detailPqrsDataForm.reset();
    this.isNoData = this.detailPqrs.length > 0 ? false : true;

    for (let i = 0; i < this.detailPqrs.length; i++) {

      var lastInvoice = this.detailPqrs[i].lastInvoice;

      this.detailPqrsFormCall.push(
        this.items({
          id: i,
          detailId: this.detailPqrs[i].detailId,
          creditNote: this.detailPqrs[i].creditNote,
          productId: this.detailPqrs[i].productId,
          description: this.detailPqrs[i].productName,
          sizes: this.detailPqrs[i].sizes,
          graphicFile: this.detailPqrs[i].graphicFile,
          unitMeasure: this.detailPqrs[i].unitMeasure,
          quantity: this.detailPqrs[i].quantity,
          quantityInvoice: this.detailPqrs[i].quantityInvoice,
          salePrice: this.detailPqrs[i].salePrice,
          salePriceInvoice: this.detailPqrs[i].salePriceInvoice,
          salesUnit: this.detailPqrs[i].salesUnit,
          total: this.detailPqrs[i].total,
          lastInvoiceYes: lastInvoice,
          lastInvoiceNo: !lastInvoice,
          billTypeId: this.detailPqrs[i].billTypeId,
          isNew: false,
          isEdit: false,
          isDelete: false
        })
      );
    }

    if(this.isReadOnlyComponent) this.blockFormsDetailPqrsFormCall();
  }

  private items(data: any): FormGroup {
    return this.formBuilder.group({
      id: [data.id, Validators.nullValidator],
      detailId: [data.detailId, Validators.nullValidator],
      creditNote: [data.creditNote, Validators.nullValidator],
      productId: [data.productId, Validators.nullValidator],
      description: [data.description, Validators.nullValidator],
      sizes: [data.sizes, Validators.nullValidator],
      graphicFile: [data.graphicFile, Validators.nullValidator],
      unitMeasure: [data.unitMeasure, Validators.nullValidator],
      quantity: [data.quantity, this.requestTypeId == 3 ? Validators.nullValidator :  Validators.required],
      quantityInvoice: [data.quantityInvoice, Validators.nullValidator],
      salePrice: [data.salePrice, this.requestTypeId == 3 ? Validators.nullValidator :  Validators.required],
      salePriceInvoice: [data.salePriceInvoice, Validators.nullValidator],
      salesUnit: [data.salesUnit, Validators.nullValidator],
      total: [data.total, Validators.nullValidator],
      lastInvoiceYes: [data.lastInvoiceYes, Validators.nullValidator],
      lastInvoiceNo: [data.lastInvoiceNo, Validators.nullValidator],
      billTypeId: [data.billTypeId, Validators.nullValidator],
      isNew: [data.isNew, Validators.nullValidator],// cuando se agrega desde add item
      isEdit: [data.isEdit, Validators.nullValidator],// elimina el elemento
      isDelete: [data.isDelete, Validators.nullValidator],// elimina el elemento
    });
  }

  onItemClick(rowData: any, dt: any) {
    if (dt.expandedRowKeys[rowData.id]) {
      dt.expandedRowKeys[rowData.id] = false;
    } else {
      dt.expandedRowKeys[rowData.id] = true;
    }
  }

  onSorted($event) {
    this.detailPqrs = this.sortService.sortList($event, this.detailPqrs);
    this.loadDataTable();
  }

  changeYes(data: FormGroup) {
    data.controls.lastInvoiceNo.setValue(false);
    var isNew = data.controls.isNew.value;
    if (!isNew) data.controls.isEdit.setValue(true);
  }

  changeNo(data: FormGroup) {
    data.controls.lastInvoiceYes.setValue(false);
    var isNew = data.controls.isNew.value;
    if (!isNew) data.controls.isEdit.setValue(true);
  }
  
  changeQuantityAndPrice(data: FormGroup,isquantity:boolean) 
  {    
    var quantityInvoice: number = data.controls.quantityInvoice.value;
    var salePriceInvoice: number = data.controls.salePriceInvoice.value;
    var isNew = data.controls.isNew.value;
    var quantity: number = data.controls.quantity.value;
    var salePrice: number = data.controls.salePrice.value;
    
    if(isquantity && (quantity > quantityInvoice))
    {
      this.showQuantityHigher = true;
      data.controls.quantity.setValue(quantityInvoice);      
      let total = quantityInvoice * salePrice;
      data.controls.total.setValue(total);
      return;
    }

    if(!isquantity && (salePrice > salePriceInvoice))
    {
      this.showSalesPriceHigher = true;
      data.controls.salePrice.setValue(salePriceInvoice);      
      let total = quantity * salePriceInvoice;
      data.controls.total.setValue(total);
      return;
    }
  
    let total = quantity * salePrice;
    data.controls.total.setValue(total);
    if (!isNew) data.controls.isEdit.setValue(true);
  }

  changeBillType(data: FormGroup) {
    var isNew = data.controls.isNew.value;
    if (!isNew) data.controls.isEdit.setValue(true);
  }

  // --- modal
  openModalAddArticle() {
    
    var data = {
      orderId: (this.purchaseOrderId == "" || this.purchaseOrderId == null) ? null : this.purchaseOrderId,
      billDocumentNumber: (this.billDocumentId == "" || this.billDocumentId == null) ? null : this.billDocumentId,
    }

    this.pqrsService.getDetailOrder(data)
      .subscribe(
        (response) => {
          if (response) {
            this.showAddArticle = true;
            this.allArticleOrder = response.data;
            this.loadDataTableDetailOrder();
          }
          else {

            this.allArticleOrder = [];
            this.allArticleOrderFormCall.clear();
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
          this.allArticleOrder = [];
          this.allArticleOrderFormCall.clear();
          this.showOrderNotFound = true;          
        }
      );
  }

  loadDataTableDetailOrder() {
    this.allArticleOrderFormCall.clear();
    this.allArticleOrderDataForm.reset();

    for (let i = 0; i < this.allArticleOrder.length; i++) {

      this.allArticleOrderFormCall.push(
        this.itemsOrderOrInvoice({
          id: i,
          productId: this.allArticleOrder[i].productId,
          productName: this.allArticleOrder[i].productName,
          sizes: this.allArticleOrder[i].sizes,
          unitMeasure: this.allArticleOrder[i].unitMeasure,
          salesUnit: this.allArticleOrder[i].salesUnit,
          salePrice: this.allArticleOrder[i].salePrice,
          quantity: this.allArticleOrder[i].quantity,
          total: this.allArticleOrder[i].total,
          creditNote: this.allArticleOrder[i].creditNote,
          graphicFile: this.allArticleOrder[i].graphicFile,
          lastInvoice: this.allArticleOrder[i].lastInvoice,
          check: false
        })
      );
    }
  }

  private itemsOrderOrInvoice(data: any): FormGroup {
    return this.formBuilder.group({
      id: [data.id, Validators.nullValidator],
      productId: [data.productId, Validators.nullValidator],
      productName: [data.productName, Validators.nullValidator],
      sizes: [data.sizes, Validators.nullValidator],
      unitMeasure: [data.unitMeasure, Validators.nullValidator],
      salesUnit: [data.salesUnit, Validators.nullValidator],
      salePrice: [data.salePrice, Validators.nullValidator],
      quantity: [data.quantity, Validators.nullValidator],
      total: [data.total, Validators.nullValidator],
      creditNote: [data.creditNote, Validators.nullValidator],
      graphicFile: [data.graphicFile, Validators.nullValidator],
      lastInvoice: [data.lastInvoice, Validators.nullValidator],
      check: [data.check, Validators.nullValidator],
    });
  }

  onSortedAllArticle($event) {
    this.allArticleOrder = this.sortService.sortList($event, this.allArticleOrder);
    this.loadDataTableDetailOrder();
  }

  getRowPar(id: number) {
    return id % 2 == 0 ? 'row-white' : '';
  }

  changeCheck(event) {
    this.allArticleOrderFormCall.controls.forEach(element => {
      var formGroup = element as FormGroup;
      formGroup.controls.check.setValue(event.srcElement.checked);
    });

    $("#checkRow").click();
  }

  onCloseDialog(check,search) {    
    check.checked = false;
    this.searchSelectorComponent.valueInput.nativeElement.value = "";
  }

  onSubmitFilterSearch(article: string) {
    if (article.length > 0) {
      this.allArticleOrderFormCall.clear();

      var data = this.allArticleOrder.filter(x => x.productId.includes(article));

      for (let i = 0; i < data.length; i++) {

        this.allArticleOrderFormCall.push(
          this.itemsOrderOrInvoice({
            id: i,
            productId: data[i].productId,
            description: data[i].description,
            previous_requests: data[i].previous_requests,
            check: false
          })
        );
      }
    }
    else {
      this.loadDataTableDetailOrder();
    }
  }

  addArticle() {
    this.articleRepeat = [];

    this.allArticleOrderFormCall.controls.forEach(element => {
      var controlsArticle = element as FormGroup;

      var check = controlsArticle.controls.check.value;
      var productId = controlsArticle.controls.productId.value;
      var productName = controlsArticle.controls.productName.value;
      var sizes = controlsArticle.controls.sizes.value;
      var unitMeasure = controlsArticle.controls.unitMeasure.value;
      var salesUnit = controlsArticle.controls.salesUnit.value;
      var salePrice = controlsArticle.controls.salePrice.value;
      var quantity = controlsArticle.controls.quantity.value;
      var total = controlsArticle.controls.total.value;
      var creditNote = controlsArticle.controls.creditNote.value;
      var graphicFile = controlsArticle.controls.graphicFile.value;


      if (check) {
        this.isNoData = false;

        var formGroupTechnicalParameter = this.detailPqrsFormCall.controls as FormGroup[];
        var isRepeat = formGroupTechnicalParameter.findIndex(x => x.controls.productId.value == productId);

        if (isRepeat >= 0) {
          this.articleRepeat.push(productId);
        }
        else {
          this.detailPqrs.push({
            detailId: 0,
            creditNote: creditNote,
            productId: productId,
            description: productName,
            sizes: sizes,
            graphicFile: graphicFile,
            unitMeasure: unitMeasure,
            quantity: quantity,
            salePrice: salePrice,            
            salesUnit: salesUnit,
            lastInvoice : false,
            billTypeId : 11,
            total: total            
          });

          this.detailPqrsFormCall.push(
            this.items({
              id: this.detailPqrsFormCall.controls.length + 1,
              productId: productId,
              description: productName,
              sizes: sizes,
              creditNote: creditNote,
              graphicFile: graphicFile,
              unitMeasure: unitMeasure,
              quantity: quantity,
              quantityInvoice: quantity,              
              salePrice: salePrice,
              salePriceInvoice: salePrice,
              salesUnit: salesUnit,
              total: total,
              lastInvoiceYes: false,
              lastInvoiceNo: true,
              billTypeId : 11,
              isNew: true,
              isEdit: false,
              isDelete: false
            })
          );
        }

        if (isRepeat >= 0) this.showAddArticleFail = true;
      }
    });

    this.showAddArticle = false;
  }

  cancelAddArticle() {
    this.showAddArticle = false;
  }

  deleteArticle(data: FormGroup, rowIndex) {
    var isNew = data.controls.isNew.value;

    if (isNew) {
      this.detailPqrsFormCall.removeAt(rowIndex);
    }
    else {
      data.controls.isDelete.setValue(true);
    }  
  }

  saveDetail() {
    
    var detail = this.detailPqrsFormCall.controls as FormGroup[];

    var dataIsNew: FormGroup[] = detail.filter(x => x.controls.isNew.value == true);
    if (dataIsNew.length > 0) {
      var creatDetails = [];

      dataIsNew.forEach(element => {
        var productId = element.controls.productId.value;
        var quantity = element.controls.quantity.value;
        var quantityInvoice = element.controls.quantityInvoice.value;
        var unitMeasure = element.controls.unitMeasure.value;
        var salePrice = element.controls.salePrice.value;
        var salePriceInvoice = element.controls.salePriceInvoice.value;
        var lastInvoice = element.controls.lastInvoiceYes.value;
        var salesUnit = element.controls.salesUnit.value;
        var total = element.controls.total.value;
        var creditNote = element.controls.creditNote.value;
        var billTypeId = element.controls.billTypeId.value;
        
        creatDetails.push({
          productId: productId,
          quantity: quantity == null ? 0 : quantity,
          quantityInvoice: quantityInvoice,
          salePrice: salePrice == null ? 0 : salePrice,
          salePriceInvoice: salePriceInvoice,
          unitMeasure: unitMeasure,
          lastInvoice: lastInvoice,
          salesUnit: salesUnit,
          total: total,
          creditNote: creditNote,
          billTypeId: billTypeId,
          createdByUser: this.currentUserAplication.email
        });
      });

      var dataInsert =
      {
        documentId: this.documentId,
        creatDetailsDto: creatDetails
      }

      
      
      this.pqrsService.createDetailOrder(dataInsert)
      .subscribe(
        (response) => {
          if (response) 
          {
            
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

    var dataIsEdit: FormGroup[] = detail.filter(x => x.controls.isEdit.value == true && x.controls.isDelete.value == false);
    if (dataIsEdit.length > 0) {
      var updateDetails = [];

      dataIsEdit.forEach(element => {
        var productId = element.controls.productId.value;
        var quantity = element.controls.quantity.value;
        var salePrice = element.controls.salePrice.value;
        var lastInvoice = element.controls.lastInvoiceYes.value;
        var billTypeId = element.controls.billTypeId.value;
        var total = element.controls.total.value;

        updateDetails.push({
          documentId: this.documentId,
          productId: productId,
          quantity: quantity,
          salePrice: salePrice,
          lastInvoice: lastInvoice,
          billTypeId: billTypeId,
          total: total,
          modifiedByUser: this.currentUserAplication.email
        });
      });

      var dataUpdate =
      {
        documentId: this.documentId,
        updateDetailsDto: updateDetails
      }

      this.pqrsService.updateDetailOrder(dataUpdate)
      .subscribe(
        (response) => {
          if (response) 
          {
            
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

    var dataIsDelete = detail.filter(x => x.controls.isDelete.value == true);
    if (dataIsDelete.length > 0) {
      var deleteDetails = [];

      dataIsDelete.forEach(element => {
        var productId = element.controls.productId.value;
        var detailId = element.controls.detailId.value;


        deleteDetails.push({
          productId: productId,
          detailId: detailId,
          documentId: this.documentId
        });
      });

      var dataDelete =
      {
        deleteDetailsDto: deleteDetails
      }

      this.pqrsService.deleteDetailOrder(dataDelete)
      .subscribe(
        (response) => {
          if (response) 
          {
            
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

  }

}

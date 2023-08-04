import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormGroupDirective } from '@angular/forms';
import { PqrsService } from 'src/app/core/services/pqrs/pqrs.service';
import { PqrsMastersService } from 'src/app/core/services/pqrs-masters/pqrs-masters.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { SortService } from 'src/app/core/services/sort/sort.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { SearchSelectorPrincipalComponent } from '../../../../../shared/framework-ui/custom/search-selector/search-selector.component';
import moment from 'moment';

declare var $: any;
@Component({
  selector: 'app-information-additional',
  templateUrl: './information-additional.component.html',
  styleUrls: ['./information-additional.component.css'],
  providers: [MessageService]
})
export class InformationAdditionalComponent implements OnInit {

  currentUserAplication: any;
  language = this.storageService.getLanguage();
  format: string = this.language == "en" ? 'MMM/DD/YYYY' : 'DD/MMM/YYYY';

  @Input() documentId: string;
  @Input() requestTypeId: number = 0;
  @Input() purchaseOrderId:string;
  @Input() billDocumentId:string;
  @Input() isReadOnlyComponent: boolean = false;


  //info-aditional
  registerFormAditional: FormGroup;
  formOneIconStatusOne = 0;
  formOneStatusTextOne = "";

  additionalInformation;
  sentBy = [];
  provision = [];
  cause = [];
  replacement = [];
  endOfTheOrder = [];


  @ViewChild('ngForm') ngForm: FormGroupDirective;
  submitted: boolean;
  settingsReceptionDate = {
    minDate: new Date(2021, 1 - 1, 1),
    isRange: false,
    required: false,
    dateFormat: this.language == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['receptionDate'],
    labels: 'pqrs.info-aditional-goods-reception-date',    
  };

  settingsSendDate = {
    minDate: new Date(2021, 1 - 1, 1),
    isRange: false,
    required: false,
    dateFormat: this.language == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['sendDate'],
    labels: '',
  };

  //customer
  isNoDataCutomer: boolean = true;
  expandedRows: {} = {};
  technicalParameter = [];
  technicalParameterDataForm: FormGroup;
  get technicalParameterFormCall() {
    return this.technicalParameterDataForm.get('header') as FormArray;
  }

  typeArticle: TypeAddArticle;
  typeAddArticle = TypeAddArticle;
  showAddArticle = false;
  allArticleOrder = [];
  allArticleOrderDataForm: FormGroup;
  get allArticleOrderFormCall() {
    return this.allArticleOrderDataForm.get('header') as FormArray;
  }
  showOrderNotFound =  false;

  showAddArticleFail = false;
  articleRepeat = [];
  @ViewChild('serchArticle', { static: true }) searchSelectorComponent!: SearchSelectorPrincipalComponent;


  //involved
  involved = [];
  involvedDataForm: FormGroup;
  get involvedFormCall() {
    return this.involvedDataForm.get('header') as FormArray;
  }
  area = [];
  responsible = [];

  //requirement
  requirement = [];
  requirementDataForm: FormGroup;
  get requirementFormCall() {
    return this.requirementDataForm.get('header') as FormArray;
  }
  customerRequeriment = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private translate: TranslateService,
    private messageService: MessageService,
    private storageService: StorageService,
    private sortService: SortService,
    private pqrsService: PqrsService,
    private pqrsMastersService: PqrsMastersService
  ) { }

  ngOnInit(): void {
    this._InitForms();
    this.currentUserAplication = this.storageService.getUser();

    //info-aditional
    this.getSentBy();
    this.getProvision();
    this.getCause();
    this.getReplacement();
    this.getEndOfTheOrder();
    this.getAdditionalInformation();    
    //customer
    this.getTechnicalParameter();

    //involved
    this.getArea();   
    this.getResponsible();
    this.getInvolved();

    //requirement
    this.getCustomerRequeriment();
    this.getCustomerRequerimentRequest();
    
  }

  blockFormsRegisterFormAditional()
  {            
    for (const ctrl in this.registerFormAditional.controls)     
      this.registerFormAditional.get(ctrl).disable();          
  }

  blockFormsTechnicalParameterDataForm()
  {      
    let controlsAll = this.technicalParameterFormCall.controls;    
    for (let index = 0; index < controlsAll.length; index++) 
    {      
      let form = controlsAll[index] as FormGroup;
      for (const ctrl in form.controls) form.get(ctrl).disable();              
    }    
  }

  blockFormsInvolvedFormCall()
  {      
    let controlsAll = this.involvedFormCall.controls;    
    for (let index = 0; index < controlsAll.length; index++) 
    {      
      let form = controlsAll[index] as FormGroup;
      for (const ctrl in form.controls) form.get(ctrl).disable();              
    }    
  }

  blockFormsRequirementFormCall()
  {      
    let controlsAll = this.requirementFormCall.controls;    
    for (let index = 0; index < controlsAll.length; index++) 
    {      
      let form = controlsAll[index] as FormGroup;
      for (const ctrl in form.controls) form.get(ctrl).disable();              
    }    
  }

  _InitForms() {    
    this.registerFormAditional = this.formBuilder.group({
      requestBy: ['', [Validators.required, Validators.maxLength(50)]],
      authorizedBy: ['', [Validators.required, Validators.maxLength(50)]],
      sentById: [null, [Validators.nullValidator]],
      provisionId: [null, [ this.requestTypeId == 3 ? Validators.nullValidator : Validators.required]],
      claimsQuantity: ['', [(this.requestTypeId == 3 || this.requestTypeId == 6) ? Validators.nullValidator : Validators.required, Validators.maxLength(10)]],
      commercialDirector: ['', [Validators.maxLength(50)]],
      causeId: [null, [Validators.nullValidator]],
      receptionDate: [null, [Validators.nullValidator]],
      replacementId: [null, [Validators.nullValidator]],
      sendDate: [null, [Validators.nullValidator]],
      inventoryTransactionNumber: ['', [Validators.nullValidator]],
      documentType: ['', [Validators.maxLength(50)]],
      stockDays: [null, [Validators.nullValidator]],
      stockTime: ['', [Validators.nullValidator]],
      endOfTheOrderId: [null, [Validators.nullValidator]],
      userId: ['', [Validators.nullValidator]],
      responsibleNonConformity: ['', [Validators.nullValidator]],
    });

    this.technicalParameterDataForm = this.formBuilder.group({
      header: this.formBuilder.array([]),
    });

    this.allArticleOrderDataForm = this.formBuilder.group({
      header: this.formBuilder.array([]),
    });

    this.involvedDataForm = this.formBuilder.group({
      header: this.formBuilder.array([]),
    });

    this.requirementDataForm = this.formBuilder.group({
      header: this.formBuilder.array([]),
    });
  }

  //#region info-aditional

  validateAdditionalInformation(status:number) {

    if(this.isReadOnlyComponent)
    {
      this.formOneIconStatusOne = 0;
      this.formOneStatusTextOne = "";
    }
    else
    {
      if(status == 4)
      {
        this.formOneIconStatusOne = this.registerFormAditional.valid ? 1 : 2;
        this.formOneStatusTextOne = this.registerFormAditional.valid ? "technical-sheets.session_form_completed" : "technical-sheets.session_form_without_completed";
    
        this.registerFormAditional.valueChanges.subscribe(value => {
          this.formOneIconStatusOne = this.registerFormAditional.valid ? 1 : 2;
          this.formOneStatusTextOne = this.registerFormAditional.valid ? "technical-sheets.session_form_completed" : "technical-sheets.session_form_without_completed";
        });
      }
      else
      {
        this.formOneIconStatusOne =  1;
        this.formOneStatusTextOne = "technical-sheets.session_form_completed"; 
      }    
    }
  }

  getAdditionalInformation() {
    var data = 
    {
      documentId: this.documentId
    };

    this.pqrsService.getAdditionalInformation(data)
      .subscribe(
        (response) => {
          if (response) {
            this.additionalInformation = response.data;            

            if (this.additionalInformation != null) 
            {

              let receptionDate = this.additionalInformation.receptionDate;
              let _receptionDate = moment(this.additionalInformation.receptionDate).format(this.format);              
              let sendDate = this.additionalInformation.sendDate;
              var _sendDate = moment(this.additionalInformation.sendDate).format(this.format);

              this.registerFormAditional.controls.requestBy.setValue(this.additionalInformation.requestBy);
              this.registerFormAditional.controls.authorizedBy.setValue(this.additionalInformation.authorizedBy);
              this.registerFormAditional.controls.claimsQuantity.setValue(this.additionalInformation.claimsQuantity);
              this.registerFormAditional.controls.commercialDirector.setValue(this.additionalInformation.commercialDirector);
              if(receptionDate != null) this.registerFormAditional.controls.receptionDate.setValue(_receptionDate);
              if(sendDate != null) this.registerFormAditional.controls.sendDate.setValue(_sendDate);
              this.registerFormAditional.controls.inventoryTransactionNumber.setValue(this.additionalInformation.inventoryTransactionNumber);
              this.registerFormAditional.controls.causeId.setValue(this.additionalInformation.causeId);
              this.registerFormAditional.controls.provisionId.setValue(this.additionalInformation.provisionId);
              this.registerFormAditional.controls.endOfTheOrderId.setValue(this.additionalInformation.endOfTheOrderId);
              this.registerFormAditional.controls.sentById.setValue(this.additionalInformation.sentById);
              this.registerFormAditional.controls.replacementId.setValue(this.additionalInformation.replacementId);
              this.registerFormAditional.controls.documentType.setValue(this.additionalInformation.documentType);
              this.registerFormAditional.controls.stockDays.setValue(this.additionalInformation.stockDays);
              this.registerFormAditional.controls.stockTime.setValue(this.additionalInformation.stockTime);
              this.registerFormAditional.controls.userId.setValue(this.additionalInformation.userId);
              this.registerFormAditional.controls.responsibleNonConformity.setValue(this.additionalInformation.responsibleNonConformity);

              if(this.isReadOnlyComponent) this.blockFormsRegisterFormAditional();
            }            
          }
          else
          {            
            if(this.isReadOnlyComponent) this.blockFormsRegisterFormAditional();
            this.registerFormAditional.controls.sentById.setValue(1);
            this.registerFormAditional.controls.replacementId.setValue(1);
          }        
        },
        (error) => {
          
          if(this.isReadOnlyComponent) this.blockFormsRegisterFormAditional();

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        }
      );
  }

  getSentBy() {
    var data = {};
    this.pqrsMastersService.getSentBy(data)
      .subscribe(
        (response) => {
          if (response) {
            this.sentBy = response.data;
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

  getProvision() {
    var data = {};
    this.pqrsMastersService.getProvision(data)
      .subscribe(
        (response) => {
          if (response) {
            this.provision = response.data;
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

  getCause() {
    var data = {};
    this.pqrsMastersService.getCause(data)
      .subscribe(
        (response) => {
          if (response) {
            this.cause = response.data;
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

  getReplacement() {
    var data = {};
    this.pqrsMastersService.getReplacement(data)
      .subscribe(
        (response) => {
          if (response) {
            this.replacement = response.data;
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

  getEndOfTheOrder() {
    var data = {};
    this.pqrsMastersService.getEndOfTheOrder(data)
      .subscribe(
        (response) => {
          if (response) {
            this.endOfTheOrder = response.data;
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

  //#endregion


  //#region customer

  getTechnicalParameter() {
    var data =
    {
      documentId: this.documentId
    };

    this.pqrsService.getTechnicalParameter(data)
      .subscribe(
        (response) => {
          if (response) {
            this.technicalParameter = response.data;
            if (response.quantity > 0) this.isNoDataCutomer = false;

            this.loadDataTableTechnicalParameter();            
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


  addArticle() {

    this.articleRepeat = [];

    if (this.typeArticle == TypeAddArticle.customer) {

      this.allArticleOrderFormCall.controls.forEach(element => {
        var controlsArticle = element as FormGroup;

        var check = controlsArticle.controls.check.value;
        var productId = controlsArticle.controls.productId.value;


        if (check) {
          this.isNoDataCutomer = false;

          var formGroupTechnicalParameter = this.technicalParameterFormCall.controls as FormGroup[];
          var isRepeat = formGroupTechnicalParameter.findIndex(x => x.controls.productId.value == productId);

          if (isRepeat >= 0) {
            this.articleRepeat.push(productId);
          }
          else {

            this.technicalParameter.push({
              productId: productId,
              temperature: 0,
              pressure: 0,
              time: 0,
              detachment: 0,
              isNew: true,
              isEdit: false,
              isDelete: false
            });


            this.technicalParameterFormCall.push(
              this.itemsTechnicalParameter({
                id: this.technicalParameterFormCall.controls.length + 1,
                productId: productId,
                temperature: 0,
                pressure: 0,
                time: 0,
                detachment: 0,
                isNew: true,
                isEdit: false,
                isDelete: false
              }));
          }

          if (isRepeat >= 0) this.showAddArticleFail = true;
        }
      });

    }
    else {

      this.allArticleOrderFormCall.controls.forEach(element => {
        var controlsArticle = element as FormGroup;

        var check = controlsArticle.controls.check.value;
        var productId = controlsArticle.controls.productId.value;
        var productName = controlsArticle.controls.productName.value;


        if (check) {

          var formGroupRequirement = this.requirementFormCall.controls as FormGroup[];
          var isRepeat = formGroupRequirement.findIndex(x => x.controls.productId.value == productId);

          if (isRepeat >= 0) {
            this.articleRepeat.push(productId);
          }
          else {

            this.requirementFormCall.push(
              this.itemsRequeriment({
                id: this.requirementFormCall.controls.length + 1,
                productId: productId,
                productName: productName,
                customerRequerimentId: "",
                isNew: true,
                isEdit: false,
                isDelete: false
              })
            );

          }

          if (isRepeat >= 0) this.showAddArticleFail = true;
        }
      });

    }


    this.showAddArticle = false;
  }

  loadDataTableTechnicalParameter() {
    this.technicalParameterFormCall.clear();
    this.technicalParameterDataForm.reset();

    for (let i = 0; i < this.technicalParameter.length; i++) {

      this.technicalParameterFormCall.push(
        this.itemsTechnicalParameter({
          id: i,          
          technicalParameterId: this.technicalParameter[i].technicalParameterId,
          productId: this.technicalParameter[i].productId,
          temperature: this.technicalParameter[i].temperature,
          pressure: this.technicalParameter[i].pressure,
          time: this.technicalParameter[i].time,
          detachment: this.technicalParameter[i].detachment,
          isNew: false,
          isEdit: false,
          isDelete: false
        })
      );
    }

    if(this.isReadOnlyComponent)this.blockFormsTechnicalParameterDataForm();
  }

  private itemsTechnicalParameter(data: any): FormGroup {
    return this.formBuilder.group({
      id: [data.id, Validators.nullValidator],
      technicalParameterId: [data.technicalParameterId, Validators.nullValidator],
      productId: [data.productId, Validators.nullValidator],
      temperature: [data.temperature, Validators.required],
      pressure: [data.pressure, Validators.required],
      time: [data.time, Validators.required],
      detachment: [data.detachment, Validators.required],
      isNew: [data.isNew, Validators.nullValidator],
      isEdit: [data.isEdit, Validators.nullValidator],
      isDelete: [data.isDelete, Validators.nullValidator],
    });
  }

  deletetechnicalParameter(data: FormGroup, rowIndex) {
    var isNew = data.controls.isNew.value;
    if (isNew) {
      this.technicalParameterFormCall.removeAt(rowIndex);
    }
    else {
      data.controls.isDelete.setValue(true);
    }

    var technicalParameter = this.technicalParameterFormCall.controls as FormGroup[];
    var dataIsDelete = technicalParameter.filter(x => x.controls.isDelete.value == true);
    if (dataIsDelete.length == technicalParameter.length) this.isNoDataCutomer = true;
  }

  changeValues(data: FormGroup) {
    var isNew = data.controls.isNew.value;
    if (!isNew) {
      data.controls.isEdit.setValue(true);
    }
  }

  onItemClick(rowData: any, dt: any) {
    if (dt.expandedRowKeys[rowData.id]) {
      dt.expandedRowKeys[rowData.id] = false;
    } else {
      dt.expandedRowKeys[rowData.id] = true;
    }
  }

  /// modal article

  openAddArticle(typeAddArticle: TypeAddArticle) {
    this.typeArticle = typeAddArticle;

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
          previous_requests: this.allArticleOrder[i].previous_requests,
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
      previous_requests: [data.previous_requests, Validators.nullValidator],
      check: [data.check, Validators.nullValidator]
    });
  }

  onSubmitFilterSearch(article: string) {

    if (article.length > 0) {
      this.allArticleOrderFormCall.clear();

      var data = this.allArticleOrder.filter(x => x.productId.includes(article));

      console.log("data:", data);
      for (let i = 0; i < data.length; i++) {

        this.allArticleOrderFormCall.push(
          this.itemsOrderOrInvoice({
            id: i,
            productId: data[i].productId,
            productName: data[i].productName,
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

  onSortedAllArticle($event) {
    this.allArticleOrder = this.sortService.sortList($event, this.allArticleOrder);
    this.loadDataTableDetailOrder();
  }

  changeCheck(event) {
    this.allArticleOrderFormCall.controls.forEach(element => {
      var formGroup = element as FormGroup;
      formGroup.controls.check.setValue(event.srcElement.checked);
    });
  }

  cancelAddArticle() {
    this.showAddArticle = false;
  }

  onCloseDialog(check) {
    check.checked = false;
    this.searchSelectorComponent.valueInput.nativeElement.value = "";
  }



  //#endregion


  //#region involved

  getInvolved() {
    var data = {
      documentId: this.documentId,
    };

    this.pqrsService.getRequestResponsible(data)
      .subscribe(
        (response) => {
          if (response) {
            this.involved = response.data;
            this.loadDataTableInvolved();            
          }          
        },
        (error) => {         
        }
      );
  }

  loadDataTableInvolved() {
    this.involvedFormCall.clear();
    this.involvedDataForm.reset();

    for (let i = 0; i < this.involved.length; i++) {

      this.involvedFormCall.push(
        this.itemsInvolved({
          id: i,
          requestResponsibleId: this.involved[i].requestResponsibleId,
          areaId: this.involved[i].areaId,
          jobId: this.involved[i].jobId,
          jobName: this.involved[i].jobName,
          responsibleId: this.involved[i].responsibleId,
          isNew: false,
          isEdit: false,
          isDelete: false,
        })
      );
    }

    if(this.isReadOnlyComponent)this.blockFormsInvolvedFormCall();
  }

  private itemsInvolved(data: any): FormGroup {
    return this.formBuilder.group({
      id: [data.id, Validators.nullValidator],      
      requestResponsibleId: [data.requestResponsibleId, Validators.nullValidator],
      areaId: [data.areaId, Validators.required],
      jobId: [data.jobId, Validators.nullValidator],
      jobName: [data.jobName, Validators.nullValidator],
      responsibleId: [data.responsibleId, Validators.required],
      isNew: [data.isNew, Validators.nullValidator],
      isEdit: [data.isEdit, Validators.nullValidator],
      isDelete: [data.isDelete, Validators.nullValidator],
    });
  }

  getArea() {
    var data = {};
    this.pqrsService.getArea(data)
      .subscribe(
        (response) => {
          if (response) {
            this.area = response.data;
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

  getResponsible() {
    var data = {};
    this.pqrsService.getResponsible(data)
      .subscribe(
        (response) => {
          if (response) {
            this.responsible = response.data;
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

  // getResponsibleByAreaId(area) 
  // {
  //   var data = {
  //     areaId : area
  //   };
    
  //   this.pqrsService.getResponsibleGetByAreaId(data)
  //     .subscribe(
  //       (response) => {
  //         if (response) {
  //           this.responsible = response.data;
  //         }
  //         else {
  //           this.translate
  //             .stream('general.msgDetailResponse')
  //             .subscribe((res: string) => {
  //               this.messageService.add({
  //                 severity: 'info',
  //                 summary: 'Info',
  //                 detail: res,
  //               });
  //             });
  //         }
  //       },
  //       (error) => {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail: error.message,
  //         });
  //       }
  //     );
  // }

  getRowPar(id: number) {
    return id % 2 == 0 ? 'row-white' : '';
  }

  addInvolved() {

    this.involvedFormCall.push(
      this.itemsInvolved({
        id: this.involvedFormCall.controls.length + 1,
        areaId: "",
        jobId: "",
        jobName: "",
        responsibleId: "",
        isNew: true,
        isEdit: false,
        isDelete: false
      })
    );
  }

  deleteInvolved(data: FormGroup, rowIndex) {

    var isNew = data.controls.isNew.value;

    if (isNew) {
      this.involvedFormCall.removeAt(rowIndex);
    }
    else {
      data.controls.isDelete.setValue(true);
    }
  }

  changeResponsibleCol(data: FormGroup,isResponsibleId) {
    let isNew = data.controls.isNew.value;
    if (!isNew) data.controls.isEdit.setValue(true);

    if(isResponsibleId)
    {
      let responsibleId = data.controls.responsibleId.value;    
      let responsible = this.responsible.filter(x => x.responsibleId == responsibleId);
      data.controls.jobName.setValue(responsible[0].jobName);
      //this.getResponsibleByAreaId(areaId);      
    }    
  }


  //#endregion


  //#region requerimient

  getCustomerRequerimentRequest() {
    var data = 
    {
      documentId: this.documentId
    };

    this.pqrsService.getCustomerRequerimentRequest(data)
      .subscribe(
        (response) => {
          if (response) {
            this.requirement = response.data;
            this.loadDataTableRequeriment();
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

  loadDataTableRequeriment() {
    this.requirementFormCall.clear();
    this.requirementDataForm.reset();

    for (let i = 0; i < this.requirement.length; i++) {

      this.requirementFormCall.push(
        this.itemsRequeriment({
          id: i,          
          customerRequerimentRequestId: this.requirement[i].customerRequerimentRequestId,
          productId: this.requirement[i].productId,
          productName: this.requirement[i].productName,
          customerRequerimentId: this.requirement[i].customerRequerimentId,
          isNew: false,
          isEdit: false,
          isDelete: false,
        })
      );
    }

    if(this.isReadOnlyComponent)this.blockFormsRequirementFormCall();

  }

  private itemsRequeriment(data: any): FormGroup {
    return this.formBuilder.group({
      id: [data.id, Validators.nullValidator],      
      customerRequerimentRequestId: [data.customerRequerimentRequestId, Validators.nullValidator],
      productId: [data.productId, Validators.nullValidator],
      productName: [data.productName, Validators.nullValidator],
      customerRequerimentId: [data.customerRequerimentId, Validators.required],
      isNew: [data.isNew, Validators.nullValidator],
      isEdit: [data.isEdit, Validators.nullValidator],
      isDelete: [data.isDelete, Validators.nullValidator],
    });
  }


  getCustomerRequeriment() {

    var data = {};

    this.pqrsMastersService.getCustomerRequeriment(data)
      .subscribe(
        (response) => {
          if (response) {
            this.customerRequeriment = response.data;
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

  addRequirement() {
    this.showAddArticle = true;
  }

  deleteCustomerRequerimentRequest(data: FormGroup, rowIndex) {
    var isNew = data.controls.isNew.value;
    if (isNew) {
      this.requirementFormCall.removeAt(rowIndex);
    }
    else {
      data.controls.isDelete.setValue(true);
    }
  }

  changecustomerRequeriment(data: FormGroup) {
    var isNew = data.controls.isNew.value;
    if (!isNew) {
      data.controls.isEdit.setValue(true);
    }
  }

  //#endregion


  saveinfoAddtional() {

    //info-aditional
    if(this.formOneIconStatusOne ==  1)
    {
      if (this.additionalInformation != null) 
      {
              
        var _receptionDate = this.registerFormAditional.get('receptionDate').value ?
                      moment(this.registerFormAditional.get('receptionDate').value.split(' - ')[0], this.format)
                      .format('YYYY-MM-DD') : null;   
        
        var _sendDate = this.registerFormAditional.get('sendDate').value ?
                      moment(this.registerFormAditional.get('sendDate').value.split(' - ')[0], this.format)
                      .format('YYYY-MM-DD') : null;                                                          
  
        let dataUpdate =
        {
          documentId: this.documentId,
          requestBy: this.registerFormAditional.controls.requestBy.value,
          authorizedBy: this.registerFormAditional.controls.authorizedBy.value,
          claimsQuantity: this.registerFormAditional.controls.claimsQuantity.value,
          commercialDirector: this.registerFormAditional.controls.commercialDirector.value,
          receptionDate: _receptionDate,
          sendDate: _sendDate,
          inventoryTransactionNumber: this.registerFormAditional.controls.inventoryTransactionNumber.value,
          causeId: this.registerFormAditional.controls.causeId.value,
          provisionId: this.registerFormAditional.controls.provisionId.value,
          endOfTheOrderId: this.registerFormAditional.controls.endOfTheOrderId.value,
          sentById: this.registerFormAditional.controls.sentById.value,
          replacementId: this.registerFormAditional.controls.replacementId.value,
          documentType: this.registerFormAditional.controls.documentType.value,
          stockDays: this.registerFormAditional.controls.stockDays.value,
          stockTime: this.registerFormAditional.controls.stockTime.value,
          userId: this.registerFormAditional.controls.userId.value,
          responsibleNonConformity: this.registerFormAditional.controls.responsibleNonConformity.value,
          modifiedByUser: this.currentUserAplication.email
        }
  
        this.pqrsService.updateAdditionalInformation(dataUpdate)
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
      else {
        
        var _receptionDate = this.registerFormAditional.get('receptionDate').value ?
                            moment(this.registerFormAditional.get('receptionDate').value.split(' - ')[0], this.format)
                            .format('YYYY-MM-DD') : null;   

        var _sendDate = this.registerFormAditional.get('sendDate').value ?
                        moment(this.registerFormAditional.get('sendDate').value.split(' - ')[0], this.format)
                        .format('YYYY-MM-DD') : null;             
  
        let dataInsert =
        {
          documentId: this.documentId,
          requestBy: this.registerFormAditional.controls.requestBy.value,
          authorizedBy: this.registerFormAditional.controls.authorizedBy.value,
          claimsQuantity: this.registerFormAditional.controls.claimsQuantity.value,
          commercialDirector: this.registerFormAditional.controls.commercialDirector.value,
          receptionDate: _receptionDate,
          sendDate: _sendDate,        
          inventoryTransactionNumber: this.registerFormAditional.controls.inventoryTransactionNumber.value,
          causeId: this.registerFormAditional.controls.causeId.value,
          provisionId: this.registerFormAditional.controls.provisionId.value,
          endOfTheOrderId: this.registerFormAditional.controls.endOfTheOrderId.value,
          sentById: this.registerFormAditional.controls.sentById.value,
          replacementId: this.registerFormAditional.controls.replacementId.value,
          documentType: this.registerFormAditional.controls.documentType.value,
          stockDays: this.registerFormAditional.controls.stockDays.value,
          stockTime: this.registerFormAditional.controls.stockTime.value,
          userId: this.registerFormAditional.controls.userId.value,
          responsibleNonConformity: this.registerFormAditional.controls.responsibleNonConformity.value,
          createdByUser: this.currentUserAplication.email
        }
      
        this.pqrsService.createAdditionalInformation(dataInsert)
        .subscribe(
          (response) => {
            if (response) 
            {
              //console.log("inserto----:",dataInsert);
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

    //customer
    if (this.technicalParameterFormCall.controls.length > 0) {

      let technicalParameter = this.technicalParameterFormCall.controls as FormGroup[];

      let dataIsNew: FormGroup[] = technicalParameter.filter(x => x.controls.isNew.value == true);
      if (dataIsNew.length > 0) 
      {
        let createTechnicalParameter = [];

        dataIsNew.forEach(element => {

          let productId = element.controls.productId.value;
          let temperature = element.controls.temperature.value;
          let pressure = element.controls.pressure.value;
          let time = element.controls.time.value;                    
          let detachment = element.controls.detachment.value;                    


          createTechnicalParameter.push({
            documentId: this.documentId,
            productId: productId,
            temperature: temperature,
            pressure: pressure,
            time: time,
            detachment: detachment,
            createdByUser: this.currentUserAplication.email
          });
        });

        let dataInsert =
        {          
          createTechnicalParameterDtos: createTechnicalParameter
        }

        this.pqrsService.createTechnicalParameter(dataInsert)
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

      let dataIsEdit: FormGroup[] = technicalParameter.filter(x => x.controls.isEdit.value == true && x.controls.isDelete.value == false);
      if (dataIsEdit.length > 0) {
        let updateTechnicalParameter = [];

        dataIsEdit.forEach(element => {

          let technicalParameterId = element.controls.technicalParameterId.value;
          let temperature = element.controls.temperature.value;
          let pressure = element.controls.pressure.value;
          let time = element.controls.time.value;                    
          let detachment = element.controls.detachment.value;                    

          updateTechnicalParameter.push({            
            technicalParameterId: technicalParameterId,
            temperature: temperature,
            pressure: pressure,
            time: time,
            detachment: detachment,            
            modifiedByUser: this.currentUserAplication.email
          });
        });

        let dataUpdate =
        {          
          updateTechnicalParameterDto: updateTechnicalParameter
        }

        this.pqrsService.updateTechnicalParameter(dataUpdate)
        .subscribe(
          (response) => {
            if (response) 
            {
              //console.log("actualizo-------------------",dataUpdate);
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

      let dataIsDelete = technicalParameter.filter(x => x.controls.isDelete.value == true);
      if (dataIsDelete.length > 0) {
        var deleteTechnicalParameter = [];

        dataIsDelete.forEach(element => {

          var technicalParameterId = element.controls.technicalParameterId.value;

          deleteTechnicalParameter.push({
            technicalParameterId: technicalParameterId,            
          });
        });

        let dataDelete =
        {
          deleteTechnicalParameterDto: deleteTechnicalParameter
        }

        this.pqrsService.deleteTechnicalParameter(dataDelete)
        .subscribe(
          (response) => {
            if (response) 
            {
              //console.log("delete ------------------",dataDelete);
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

    //involved
    if (this.involvedFormCall.controls.length > 0) {
      let requestResponsible = this.involvedFormCall.controls as FormGroup[];

      let dataIsNew: FormGroup[] = requestResponsible.filter(x => x.controls.isNew.value == true);
      if (dataIsNew.length > 0) 
      {
        let createRequestResponsible = [];

        dataIsNew.forEach(element => {

          var responsibleId = element.controls.responsibleId.value;

          createRequestResponsible.push({
            documentId: this.documentId,
            responsibleId: responsibleId,            
            createdByUser: this.currentUserAplication.email
          });
        });

        let dataInsert =
        {          
          createRequestResponsibleDtos: createRequestResponsible
        }

        this.pqrsService.createRequestResponsible(dataInsert)
        .subscribe(
          (response) => {
            if (response) 
            {
              //console.log("INSERT------------",dataInsert);
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

      let dataIsEdit: FormGroup[] = requestResponsible.filter(x => x.controls.isEdit.value == true && x.controls.isDelete.value == false);
      if (dataIsEdit.length > 0) {
        let updateRequestResponsible = [];

        dataIsEdit.forEach(element => {

          let requestResponsibleId = element.controls.requestResponsibleId.value;
          let responsibleId = element.controls.responsibleId.value;          

          updateRequestResponsible.push({            
            requestResponsibleId: requestResponsibleId,
            responsibleId: responsibleId,
          });
        });

        let dataUpdate =
        {
          updateRequestResponsibles: updateRequestResponsible,
          modifiedByUser: this.currentUserAplication.email
        }

        this.pqrsService.updateRequestResponsible(dataUpdate)
        .subscribe(
          (response) => {
            if (response) 
            {
              //console.log("UPDATE-------------------",dataUpdate);
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

      var dataIsDelete = requestResponsible.filter(x => x.controls.isDelete.value == true);
      if (dataIsDelete.length > 0) {
        var deleteRequestResponsible = [];

        dataIsDelete.forEach(element => {

          var requestResponsibleId = element.controls.requestResponsibleId.value;

          deleteRequestResponsible.push({
            requestResponsibleId: requestResponsibleId,            
          });
        });

        var dataDelete =
        {
          deleteRequestResponsibles: deleteRequestResponsible
        }

        this.pqrsService.deleteRequestResponsible(dataDelete)
        .subscribe(
          (response) => {
            if (response) 
            {
              //console.log("DELETE ------------------",dataDelete);
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

    //requerimient
    if (this.requirementFormCall.controls.length > 0) {
      let customerRequerimentRequest = this.requirementFormCall.controls as FormGroup[];

      let dataIsNew: FormGroup[] = customerRequerimentRequest.filter(x => x.controls.isNew.value == true);
      if (dataIsNew.length > 0) {
        let createCustomerRequerimentRequest = [];

        dataIsNew.forEach(element => {

          let productId = element.controls.productId.value;
          let customerRequerimentId = element.controls.customerRequerimentId.value;

          createCustomerRequerimentRequest.push({
            documentId: this.documentId,
            productId: productId,
            customerRequerimentId: customerRequerimentId,
            createdByUser: this.currentUserAplication.email
          });
        });

        let dataInsert =
        {
          createCustomerRequerimentRequestDtos: createCustomerRequerimentRequest
        }

        this.pqrsService.createCustomerRequerimentRequest(dataInsert)
          .subscribe(
            (response) => {
              if (response) {
                //console.log("INSERT------------", dataInsert);
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

      let dataIsEdit: FormGroup[] = customerRequerimentRequest.filter(x => x.controls.isEdit.value == true && x.controls.isDelete.value == false);
      if (dataIsEdit.length > 0) {
        let updateCustomerRequerimentRequest = [];

        dataIsEdit.forEach(element => {

          let customerRequerimentRequestId = element.controls.customerRequerimentRequestId.value;
          let customerRequerimentId = element.controls.customerRequerimentId.value;

          updateCustomerRequerimentRequest.push({            
            customerRequerimentRequestId: customerRequerimentRequestId,
            customerRequerimentId: customerRequerimentId,            
            modifiedByUser: this.currentUserAplication.email
          });
        });

        let dataUpdate =
        {          
          updateCustomerRequerimentRequestDto: updateCustomerRequerimentRequest
        }

        this.pqrsService.updateCustomerRequerimentRequest(dataUpdate)
        .subscribe(
          (response) => {
            if (response) 
            {
              //console.log("UPDATE-------------------",dataUpdate);
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

      let dataIsDelete = customerRequerimentRequest.filter(x => x.controls.isDelete.value == true);
      if (dataIsDelete.length > 0) {
        let deleteCustomerRequerimentRequest = [];

        dataIsDelete.forEach(element => {
          
          let customerRequerimentRequestId = element.controls.customerRequerimentRequestId.value;

          deleteCustomerRequerimentRequest.push({            
            customerRequerimentRequestId: customerRequerimentRequestId,            
            documentId: this.documentId
          });
        });

        let dataDelete =
        {
          deleteCustomerRequerimentRequestDto: deleteCustomerRequerimentRequest
        }

        this.pqrsService.deleteCustomerRequerimentRequest(dataDelete)
        .subscribe(
          (response) => {
            if (response) 
            {
              //console.log("DELETE ------------------",dataDelete);
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

}


export enum TypeAddArticle {
  customer,
  requeriment
}

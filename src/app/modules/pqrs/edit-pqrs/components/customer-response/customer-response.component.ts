import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { TranslateService } from '@ngx-translate/core';
import { PqrsService } from 'src/app/core/services/pqrs/pqrs.service';
import { fileUploadPqrs } from 'src/app/shared/models/fileUploadPqrs';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { PlanActionDto } from 'src/app/modules/pqrs/edit-pqrs/components/models/PqrsModel';
import * as moment from 'moment'

@Component({
  selector: 'app-customer-response',
  templateUrl: './customer-response.component.html',
  styleUrls: ['./customer-response.component.css']
})
export class CustomerResponseComponent implements OnInit {

  constructor(
    private readonly formBuilder: FormBuilder,
    public datepipe: DatePipe,
    public translate: TranslateService,
    private messageService: MessageService,    
    private storageService: StorageService,    
    private pqrsService: PqrsService
    ) { }

  language = this.storageService.getLanguage();
  format: string = this.language == "en" ? 'MMM/DD/YYYY' : 'DD/MMM/YYYY';
  settingsCloseDate = {
    minDate: new Date(2021, 1 - 1, 1),
    isRange: false,
    required: false,
    dateFormat: this.language == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['closingDate'],
    labels: 'pqrs.asnwer-customer-closing-date',
  };
    
  customerResponse;
  registerFormCustomerResponse: FormGroup;  
  currentUserAplication: any;
  @Input() documentId: string;  
  @Input() requestTypeId: number;    
  @Input() stateRequest: number;      
  @Input() isReadOnlyComponent: boolean = false;

  //menu
  itemsBreadcrumb;
  formOneIconStatusOne = 0;
  formOneStatusTextOne = "";
  planAction = new PlanActionDto();

  // files
  showNotFoundFile: boolean = false;
  acceptFileTypes: string;
  acceptDetailFileTypes: string;
  fileList: fileUploadPqrs[] = new Array<fileUploadPqrs>();
  file: any;

  // file validation error
  hideErrorType: boolean;
  hideErrorSize: boolean;
  displayInvalidateFileMessage: boolean = false;
  maxSize: string;
  allowedFileTypes = [
    'image/png',
    'image/jpeg',
    'application/pdf',
    'image/bmp',
    'image/gif',
    'image/tiff',
    'image/vnd.adobe.photoshop',
    'application/x-photoshop',
    'application/octet-stream',
    'image/vnd.adobe.photoshop',
    'application/postscript',
    'video/mp4',
    'video/avi',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  get aw() {
    return this.registerFormCustomerResponse.controls;
  }

  ngOnInit(): void {
    this._InitForms();
    this.currentUserAplication = this.storageService.getUser();
    this.getAnwerCustomer(this.documentId);    
  }
  
  _InitForms() {
    this.registerFormCustomerResponse = this.formBuilder.group({      
      closingDate: ['', [Validators.nullValidator]],
      description: ['', [Validators.nullValidator, Validators.maxLength(200)]],
      nameAttachment: ['', [Validators.nullValidator, Validators.maxLength(256)]],
      uploadEvidence: ['', [Validators.required]],
      urlAttachment: ['', Validators.nullValidator],
    });
  }


  blockFormsregisterFormCustomerResponse()
  {        
    for (const ctrl in this.registerFormCustomerResponse.controls)     
      this.registerFormCustomerResponse.get(ctrl).disable();          
  }

  getAnwerCustomer(numberRequest: string) {
    let data = {
      documentId: numberRequest
    };

    this.pqrsService.getAnswerCustomerByDocument(data)
      .subscribe(
        (response) => {
          if (response) {
            this.customerResponse = response.data;
            if (this.customerResponse != null) {
              var closingDate = moment(this.customerResponse.closingDate).format(this.format);
              this.registerFormCustomerResponse.controls.description.disable();
              this.registerFormCustomerResponse.controls.closingDate.setValue(closingDate);
              this.registerFormCustomerResponse.controls.uploadEvidence.setValue(this.customerResponse.nameAttachment);
              this.registerFormCustomerResponse.controls.description.setValue(this.customerResponse.description);
              this.registerFormCustomerResponse.controls.urlAttachment.setValue(this.customerResponse.urlAttachment);
            }
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

    if(this.isReadOnlyComponent) 
    {      
      this.blockFormsregisterFormCustomerResponse();
      this.customerResponse = {};
    }
  }

  saveAnswerCustomer() {
    if (this.customerResponse == null && (this.fileList.length > 0 || this.registerFormCustomerResponse.controls.description.value != '')) 
    {
      var dataInsert =
      {
        documentId: this.documentId,
        description: this.registerFormCustomerResponse.controls.description.value,
        createdByUser: this.currentUserAplication.email,
        files: this.fileList,
      }
      this.pqrsService.createAnwerCustomer(dataInsert)
        .subscribe(
          (response) => {
            if (response) {

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
          },
          () => { }
        );
    }
  }

  validateFormStatus(requestTypeId:number,stateRequest:number) 
  {    

    if(this.isReadOnlyComponent)
    {
      this.formOneIconStatusOne = 0;
      this.formOneStatusTextOne = "";
    }
    else
    {
      if(stateRequest == 4)
      {
        this.formOneIconStatusOne = (this.registerFormCustomerResponse.valid) ? 1 : 2;
        this.formOneStatusTextOne = (this.registerFormCustomerResponse.valid) ? "technical-sheets.session_form_completed" : "technical-sheets.session_form_without_completed";

        this.registerFormCustomerResponse.valueChanges.subscribe(value => {    
          this.formOneIconStatusOne = this.registerFormCustomerResponse.valid ? 1 : 2;
          this.formOneStatusTextOne = this.registerFormCustomerResponse.valid ? "technical-sheets.session_form_completed" : "technical-sheets.session_form_without_completed";  
        });
      }
      else
      {      
        this.formOneIconStatusOne =  1;
        this.formOneStatusTextOne = "technical-sheets.session_form_completed";      
      }
    }
  }

  // upload file logic
  public resetFiles() {
    this.aw.uploadEvidence.setValue('');
    this.fileList = new Array<fileUploadPqrs>();
  }

  async fileChanged(e, inputFile) {
    this.file = e.target.files[0];
    await this.upload(this.file, this.allowedFileTypes);
    inputFile.value = "";
  }

  async upload(fileContent: any, validator: string[]) {
    if (await this.validateUploadedFile(fileContent, validator)) {
      await this.convertFileToBase64(fileContent);
    }
  }

  async validateUploadedFile(fileContent: any, validator: string[]) {
    this.hideErrorType = true;
    this.hideErrorSize = true;
    this.displayInvalidateFileMessage = false;

    this.maxSize = environment.max_file_size_pqrs + 'MB'

    if (validator.indexOf(fileContent.type) == -1) {
      this.hideErrorType = false;
    }

    if (fileContent.size > (environment.max_file_size_pqrs * 1000000) ||
      fileContent.size == 0) {
      this.hideErrorSize = false;
    }
    this.displayInvalidateFileMessage = !this.hideErrorSize || !this.hideErrorType;
    return !this.displayInvalidateFileMessage;
  }

  async convertFileToBase64(file) {
    var self = this;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      let fileFU: fileUploadPqrs = {
        fileName: file.name,
        fileTemporal: reader.result.toString().split(',')[1]
      }

      self.fileList.push(fileFU);
      self.updateFileList();
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  updateFileList() {

    let filesUpload: string = '';
    this.fileList.forEach((item, index) => {
      filesUpload += item.fileName + ' - ';
    });
    this.aw.uploadEvidence.setValue(filesUpload);    
  }

  dowload() 
  {    
    var urlAttachment = this.registerFormCustomerResponse.controls.urlAttachment.value;    
    if (urlAttachment == null || urlAttachment == '') {
      this.showNotFoundFile = true;
    }
    else{
      const byteCharacters = atob(this.registerFormCustomerResponse.controls.urlAttachment.value);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/x-zip-compressed' });
      let url = URL.createObjectURL(blob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = this.registerFormCustomerResponse.controls.nameAttachment.value;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }
}

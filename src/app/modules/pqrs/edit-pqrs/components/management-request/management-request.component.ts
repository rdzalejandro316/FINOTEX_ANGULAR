import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { fileUploadPqrs } from 'src/app/shared/models/fileUploadPqrs';
import { environment } from 'src/environments/environment';
import { PqrsService } from 'src/app/core/services/pqrs/pqrs.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { AccessstorageService } from 'src/app/core/services/utils/accessstorage/accessstorage.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { RolesEnum } from 'src/app/modules/home_sample/components/models/role.enum';
import { SalesService } from 'src/app/core/services/sales/sales.service';
import moment from 'moment';
import { SortService } from 'src/app/core/services/sort/sort.service';

@Component({
  selector: 'app-management-request',
  templateUrl: './management-request.component.html',
  styleUrls: ['./management-request.component.css'],
  providers: [MessageService],
})
export class ManagementRequestComponent implements OnInit {
  constructor(
    private readonly formBuilder: FormBuilder,
    private pqrsService: PqrsService,
    private translate: TranslateService,
    private messageService: MessageService,
    private accessstorageService: AccessstorageService,
    private storageService: StorageService,
    private sales: SalesService,
    private sortService: SortService,
  ) { }

  public KEYPERMISSION_ROLE: string = 'management-request';
  private RolesEnum = RolesEnum;
  public rolepermission;
  isNoData: boolean = true;
  expandedRows: {} = {};
  routeRequest = [];
  routeRequestDataForm: FormGroup;
  get routeRequestFormCall() {
    return this.routeRequestDataForm.get('header') as FormArray;
  }
  managementForm: FormGroup;
  showAddManagement = false;
  area = [];
  implicated = [];
  currentUserAplication: any;
  showSuccessManagement: boolean = false;
  get aw() {
    return this.managementForm.controls;
  }
  hideErrorType: boolean;
  hideErrorSize: boolean;
  displayInvalidateFileMessage: boolean = false;
  maxSize: string;
  acceptFileTypes: string;
  acceptDetailFileTypes: string;
  fileList: fileUploadPqrs[] = new Array<fileUploadPqrs>();
  file: any;
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
  @Input() documentId: string;
  @Input() stateRequest: number;
  @Input() isReadOnlyComponent: boolean;
  
  language = this.storageService.getLanguage() == null ? 'EN' : this.storageService.getLanguage();
  format: string = this.language == "en" ? 'MMM/DD/YYYY' : 'DD/MMM/YYYY';
  stateIngress = 1;
  displayNewManagement = false;
  isUserArea = false;

  ngOnInit() {
    this._InitForm();
    this.getRole();
    this.getRouteRequest();
    this.getArea();
    this.currentUserAplication = this.storageService.getUser();
  }

  _InitForm() {
    this.routeRequestDataForm = this.formBuilder.group({
      header: this.formBuilder.array([]),
    });

    this.managementForm = this.formBuilder.group({
      areaId: ['', [Validators.required, Validators.required]],
      responsibleId: ['', [Validators.required, Validators.required]],
      description: ['', [Validators.required, Validators.required]],
      uploadEvidence: [null, []],
    });
  }

  getArea() {
    var data = {};
    this.pqrsService.getArea(data).subscribe(
      (response) => {
        if (response) {
          this.area = response.data;
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
      }
    );
  }

  getResponsible(areaId: any) {
    var data = {
      areaId: areaId.value,
    };

    this.pqrsService.getResponsibleGetByAreaId(data).subscribe(
      (response) => {
        if (response) {
          this.implicated = response.data;
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
      }
    );
  }

  public resetFiles() {
    this.aw.uploadEvidence.setValue('');
    this.fileList = new Array<fileUploadPqrs>();
  }

  async fileChanged(e, inputFile) {
    this.file = e.target.files[0];
    await this.upload(this.file, this.allowedFileTypes);
    inputFile.value = '';
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

    this.maxSize = environment.max_file_size_pqrs + 'MB';

    if (validator.indexOf(fileContent.type) == -1) {
      this.hideErrorType = false;
    }

    if (
      fileContent.size > environment.max_file_size_pqrs * 1000000 ||
      fileContent.size == 0
    ) {
      this.hideErrorSize = false;
    }
    this.displayInvalidateFileMessage =
      !this.hideErrorSize || !this.hideErrorType;
    return !this.displayInvalidateFileMessage;
  }

  async convertFileToBase64(file) {
    var self = this;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      let fileFU: fileUploadPqrs = {
        fileName: file.name,
        fileTemporal: reader.result.toString().split(',')[1],
      };

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

  openModalManagement() {
    if (this.stateRequest != this.stateIngress) {
      this.validateManagementOpen();
    }
  }

  addManagement() {
    let data = {
      areaId: this.managementForm.controls.areaId.value,
      responsibleId: this.managementForm.controls.responsibleId.value,
      documentId: this.documentId,
      requestStatusId: this.stateRequest,
      observation: this.managementForm.controls.description.value,
      isDone: false,
      files: this.fileList,
      createdByUser: this.currentUserAplication.email,
    };
    this.pqrsService.createRouteRequest(data).subscribe(
      (response) => {
        if (response) {
          this.showSuccessManagement = true;
          this.getRouteRequest();
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
      }
    );
    this.showAddManagement = false;
    this.managementForm.reset();
    this.resetFiles();
  }

  successManagement() {
    this.showSuccessManagement = false;
  }

  getRouteRequest() {
    var data = {
      documentId: this.documentId,
    };
    this.pqrsService.getRouteRequest(data).subscribe(
      (response) => {
        if (response) {
          this.routeRequest = response.data;
          if (response.quantity > 0) this.isNoData = false;
          this.loadDataTableRouteRequest();
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
      }
    );
  }

  loadDataTableRouteRequest() {
    this.routeRequestFormCall.clear();
    this.routeRequestDataForm.reset();
    for (let i = 0; i < this.routeRequest.length; i++) {
      this.routeRequestFormCall.push(
        this.itemsRouteRequest({
          id: i,
          state: this.routeRequest[i].requestStatusName,
          datetime: moment(this.routeRequest[i].routeRequestDate).format(this.language == 'en'  ? 'MMM/DD/YYYY' : 'DD/MMM/YYYY'),
          areaName: this.routeRequest[i].areaName,
          userResponsible: this.routeRequest[i].userResponsible,
          reviewedBy: this.routeRequest[i].reviewedBy,
          nameAttachment: this.routeRequest[i].attachmentName,
          observation: this.routeRequest[i].observation,
          isDone: this.routeRequest[i].isDone,
        })
      );
    }
  }

  private itemsRouteRequest(data: any): FormGroup {
    return this.formBuilder.group({
      id: [data.id, Validators.nullValidator],
      state: [data.state, Validators.nullValidator],
      datetime: [data.datetime, Validators.nullValidator],
      areaName: [data.areaName, Validators.nullValidator],
      userResponsible: [data.userResponsible, Validators.nullValidator],
      reviewedBy: [data.reviewedBy, Validators.nullValidator],
      nameAttachment: [data.nameAttachment, Validators.nullValidator],
      observation: [data.observation, Validators.nullValidator],
      isDone: [data.isDone],
    });
  }

  getFile(fileName: string) {
    if (fileName != '') {
      var data = {
        fileName: fileName,
        containerName: 'pqrsanswerarea',
      };
      this.accessstorageService.getFile(data).subscribe(
        (response) => {
          if (response) {
            this.dowload(fileName, response.data);
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
        }
      );
    }
  }

  dowload(fileName: string, data: any) {
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: 'application/x-zip-compressed',
    });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  onItemClick(rowData: any, dt: any) {
    if (dt.expandedRowKeys[rowData.id]) {
      dt.expandedRowKeys[rowData.id] = false;
    } else {
      dt.expandedRowKeys[rowData.id] = true;
    }
  }

  public getRole() {
    let profile = this.storageService.getProfiles();
    this.sales.getJSON().subscribe((roles) => {
      this.rolepermission = roles[this.RolesEnum[profile.role]];
      let rolemodule = this.rolepermission[3][this.KEYPERMISSION_ROLE];
      let active = rolemodule.filter((x) => x.status == true);
      for (let index = 0; index < active.length; index++) {
        this.managementForm.get(active[index].components).disable();
      }
      if(active.length > 0){
        this.isUserArea = true;
      }
    });
  }

  onSorted($event) {
    this.routeRequest = this.sortService.sortList($event, this.routeRequest);
    this.loadDataTableRouteRequest();
  }

  validateManagementOpen(): void {
    let count = this.routeRequestFormCall.controls.length;
    if(count > 0){
      let index = count - 1;
      let isDone = this.routeRequestFormCall.controls[index].value.isDone;
      if(!isDone && !this.isUserArea){
        this.displayNewManagement = true;
      }else{
        this.showAddManagement = true;
      }
    }else{
      this.showAddManagement = true;
    }
  }

  onCloseNewManagement(){
    this.displayNewManagement = false;
    this.showAddManagement = true;
  }
}

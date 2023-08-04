import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtworksService } from 'src/app/core/services/artworks/artworks.service';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { MasterProductService } from 'src/app/core/services/masterProduct/master-product.service';
import { SketchService } from 'src/app/core/services/sketch/sketch.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { environment } from 'src/environments/environment';
import { FileUpload } from 'src/app/shared/models/fileUpload';
import { ProfilesService } from 'src/app/core/services/profile/profiles.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-artworks-new',
  templateUrl: './artworks-new.component.html',
  styleUrls: ['./artworks-new.component.css'],
  providers: [MessageService, DatePipe]
})

export class ArtworksNewComponent implements OnInit {
  itemsBreadcrumb = [
    {label:'menu.Home', url: '/home'},
    {label:'menu.ArtWorks', url: '/home/artworks_history'},
    {label:'artWork.title_principal_new', url: '/home/artworks_new/add', current: true}
  ];
  submitted: boolean;
  display: boolean;
  displayConfirmApproved: boolean;
  cutType: any;
  file: any;
  productType = [];
  fileList: FileUpload[] = new Array<FileUpload>();
  substractType = [];
  hideErrorType: boolean;
  hideErrorSize: boolean;
  stateFabricType: boolean;
  maxSize: string;
  cutTypes = [];
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
    'application/postscript'
  ];
  allowedDetailFileTypes = [
    'application/vnd.ms-excel',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  allowedDesignerFileTypes = [
    'application/pdf'
  ];

  acceptFileTypes: string;
  acceptDetailFileTypes: string;
  displayInvalidateFileMessage: boolean;
  buttonState = false;
  customers = [];
  roleProfileCustomer = false;
  designers = [];
  sketchNew: any;
  sketchId = "";
  sketchName = "";
  subscription: Subscription;
  paramCustomerId: string;

  lineSpacing = this.profilesService.validateUserType();

  progressStatus = [
    {
      code: '1',
      name: 'New'
    },
    {
      code: '2',
      name: 'Assigned'
    },
    {
      code: '3',
      name: 'Update'
    },
    {
      code: '4',
      name: 'Completed'
    },
    {
      code: '5',
      name: 'Approved'
    },
    {
      code: '6',
      name: 'Void'
    },
  ];

  artworkForm: FormGroup;

  validateRolBuilderSalesExecutive = this.profilesService.validateRolBuilderSalesExecutive();

  constructor(
    private storageService: StorageService,
    private messageService: MessageService,
    private masterProductService: MasterProductService,
    private artworksService: ArtworksService,
    private router: Router,
    private customerService: CustomerService,
    private sketchService: SketchService,
    private formBuilder: FormBuilder,
    private profilesService: ProfilesService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    public datepipe: DatePipe) { }

  ngOnInit(): void {
    this._InitForms();

    if (!this.profilesService.validateUserType()) {

      this.serviceCustomers();
      this.roleProfileCustomer = true;
      this.aw.CustomerId.setValidators([Validators.required]);
      this.aw.designerIdForm.setValidators([Validators.required]);
    } else {
      this.roleProfileCustomer = false;
      this.aw.CustomerId.setValue(this.storageService.getGrup());
    }
    this.displayInvalidateFileMessage = false;
    this.acceptFileTypes = this.allowedFileTypes.join(',');
    this.acceptDetailFileTypes = this.allowedDetailFileTypes.join(',');
    this.getGroupLineService();
    this.configUploadFiles();
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.paramCustomerId = params.get('customerId');
      if (this.paramCustomerId != null && !this.profilesService.validateUserType()){
        this.aw.CustomerId.setValue(Number(this.paramCustomerId));
      }
    });
  }

  private _InitForms() {
    this.artworkForm = this.formBuilder.group({
      CustomerId: ['', Validators.nullValidator],
      ItemDescription: [null, [Validators.minLength(5), Validators.required]],
      GroupLine: [null, [Validators.required]],
      Dimentions: [null, [Validators.required]],
      Colors: [null, [Validators.minLength(3), Validators.required]],
      CutType: [null, [Validators.required]],
      Substrate: [null, [Validators.required]],
      FabricType: [null, [Validators.required]],
      Observations: [null, [Validators.required]],
      UploadArtFile: [null, []],
      UploadAditional: [null, []],
      designerIdForm: [null, [Validators.nullValidator]],
      designer_file: [null, [Validators.nullValidator]]
    });
  }

  changeGroupLine(event: any) {
    this.getSubstrateTypeService(this.aw.GroupLine.value);
    this.getCutType(this.aw.GroupLine.value ? Number(this.aw.GroupLine.value) : 0);
    this.enableFabricType();
    this.getDesigners(event.value);
  }

  enableFabricType() {
    let selGroupLine = this.productType.find((x: any) => x.groupLineId == this.aw.GroupLine.value);
    if (selGroupLine.groupLineName === 'Heat Transfer') {
      this.aw.FabricType.markAsTouched();
      this.aw.FabricType.setValue('');
      this.stateFabricType = true;
    }
    else {
      this.aw.FabricType.markAsTouched();
      this.aw.FabricType.setValue('NA');
      this.stateFabricType = false;
    }
  }

  getCutType(courtid: number) {
    this.cutTypes = [];
    const idGroupLine = {
      idGroupLine: courtid
    };
    this.artworksService.GetCut(idGroupLine).subscribe(
      (response) => {
        if (response.status) {
          this.cutTypes = response.data;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
        }
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
      },
      () => { }
    );
  }

  openModalCutType() {
    this.display = true;
  }

  selectCutType() {
    this.cutType = Number($("input[name='rdCutType']:checked").val());
    if (this.cutType) {
      let objCut = this.cutTypes.find(obj => {
        return obj.cutId === this.cutType
      });
      this.aw.CutType.setValue(objCut.cutName);
      this.display = false;
    }
  }

  IsValid(control: string): boolean {
    return this.artworkForm.get(control).valid;
  }

  get aw() {
    return this.artworkForm.controls;
  }

  getGroupLineService(): void {
    this.masterProductService.getGroupLine().subscribe(
      (response) => {
        if (response.status) {
          this.productType = response.data;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
        }
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
      () => { }
    );
  }

  getSubstrateTypeService(courtid: number): void {
    const datos = {
      'substrateId': 0,
      'groupLineId': courtid
    }
    this.artworksService.getSubstractByGroupLine(datos).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.substractType = response.data;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        } else {
          this.translate.stream('general.msgDetailResponse').subscribe((res: string) => {
            this.messageService.add({ severity: 'info', summary: 'Info', detail: res });
          });
        }

      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
      () => { }
    );
  }

  public resetFiles(isMain: string) {
    if (isMain == "file") {
      this.aw.UploadArtFile.setValue('');
    } else if (isMain == "addFile") {
      this.aw.UploadAditional.setValue('');
    } else if (isMain == "designer") {
      this.aw.designer_file.setValue('');
    }

    this.fileList.forEach((item, index) => {
      if (isMain == "file") {
        if (item.isMain) {
          this.fileList.splice(index, 1);
        }
      }

      if (isMain == "addFile") {
        if (!item.isMain) {
          this.fileList.splice(index, 1);
        }
      }

      if (isMain == "designer") {
        if (item.IsDesignerFile) {
          this.fileList.splice(index, 1);
        }
      }
    });
  }

  async fileChanged(e) {
    this.file = e.target.files[0];
    let isMain = true; //Main file of Skecth.
    await this.upload(this.file.name, this.file, isMain, this.allowedFileTypes, false);
  }

  async fileChangedAditional(e) {
    this.file = e.target.files[0];
    let isMain = false; //Aditional file of Skecth.
    await this.upload(this.file.name, this.file, isMain, this.allowedDetailFileTypes, false);
  }

  async fileChangedDesigner(e) {
    this.file = e.target.files[0];
    let isMain = false; //Aditional file of Skecth.
    await this.upload(this.file.name, this.file, isMain, this.allowedDesignerFileTypes, true);
  }

  async upload(fileName: string, fileContent: any, isMain: any, validator: string[], isDesigner: boolean) {
    if (await this.validateUploadedFile(fileContent, validator)) {
      await this.convertFileToBase64(fileContent, isMain, isDesigner);
    }
  }

  async validateUploadedFile(fileContent: any, validator: string[]) {
    this.hideErrorType = true;
    this.hideErrorSize = true;
    this.displayInvalidateFileMessage = false;

    this.maxSize = environment.max_file_size + 'MB'
    if (validator.indexOf(fileContent.type) == -1) {
      this.hideErrorType = false;
    }
    if (fileContent.size > (environment.max_file_size * 1000000) ||
      fileContent.size == 0) {
      this.hideErrorSize = false;
    }
    this.displayInvalidateFileMessage = !this.hideErrorSize || !this.hideErrorType;
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
        IsDesignerFile: isDesigner
      }

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
      this.aw.UploadArtFile.setValue(filesUpload);
    } else {
      if (isDesigner) {
        this.aw.designer_file.setValue(filesUpload);
      } else {
        this.aw.UploadAditional.setValue(filesUpload);
      }
    }
  }

  createSketch() {
    moment.locale(this.storageService.getLanguage());
    this.submitted = true;
    if (!this.artworkForm.valid) {
      if (!this.aw.GroupLine.value) {
        $('#ddlGroupLine').css('border: 1px solid #D6001CCC !important;');
      }
    } else {
      let latestDate = moment().format();
      const user = this.storageService.getUser();
      const sketch = {
        "SketchId": 0,
        "companyId": 1,
        "customerId": !this.profilesService.validateUserType() ? this.aw.CustomerId.value : this.storageService.getGrup(),
        "cutId": this.cutType,
        "groupLineId": this.aw.GroupLine.value,
        "substrateId": this.aw.Substrate.value ?? 1,
        "sketchName": this.aw.ItemDescription.value,
        "color": this.aw.Colors.value,
        "unitMeasures": this.aw.Dimentions.value,
        "fabricType": this.aw.FabricType.value,
        "designerId": !this.profilesService.validateUserType() ? this.aw.designerIdForm.value : null,
        "observation": this.aw.Observations.value,
        "sketchStatusId": 1,
        "createdByUser": user.username,
        "creationDate": latestDate,
        "modifiedByUser": user.username,
        "modifiedDate": latestDate,
        "sketchFiles": this.fileList
      };

      this.buttonState = true;
      this.sketchService.CreateSketch(sketch).subscribe(
        (response) => {
          if (response.status) {
            this.sketchNew = response.data;
            this.sketchId = this.sketchNew.sketchId;
            this.sketchName = this.sketchNew.sketchName;
            this.displayConfirmApproved = true;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
          this.buttonState = false;
        },
        () => {
          this.buttonState = false;
        }
      );
    }
  }

  confirmApproved() {
    this.displayConfirmApproved = false;
    this.router.navigate(['home/artworks_history']);
  }

  configUploadFiles() {
    let jQueryInstance = this;

    $('input[id^=file]').hide();

    $('#artFile').click(function () {
      $(this).
        prev('input').click();
    });

    $('#artFileAditional').click(function () {
      $(this).
        prev('input').click();
    });

    $('#artFileDesigner').click(function () {
      $(this).
        prev('input').click();
    });

    $('#txtUploadArtFile').on(
      'dragover',
      function (e) {
        e.preventDefault();
        e.stopPropagation();
      }
    )

    $('#txtUploadArtFile').on(
      'dragenter',
      function (e) {
        e.preventDefault();
        e.stopPropagation();
      }
    )

    $('#txtUploadArtFile').on(
      'drop',
      function (e) {
        if (e.originalEvent.dataTransfer) {
          if (e.originalEvent.dataTransfer.files.length) {
            e.preventDefault();
            e.stopPropagation();
            /*UPLOAD FILES HERE*/
            let file = e.originalEvent.dataTransfer.files[0];
            let fileName = file.name;
            let isMain = true; //Main file of Skecth.
            jQueryInstance.upload(fileName, file, isMain, this.allowedFileTypes, false);
          }
        }
      }
    );

    $('#txtUploadAditional').on(
      'dragover',
      function (e) {
        e.preventDefault();
        e.stopPropagation();
      }
    )

    $('#txtUploadAditional').on(
      'dragenter',
      function (e) {
        e.preventDefault();
        e.stopPropagation();
      }
    )

    $('#txtUploadAditional').on(
      'drop',
      function (e) {
        if (e.originalEvent.dataTransfer) {
          if (e.originalEvent.dataTransfer.files.length) {
            e.preventDefault();
            e.stopPropagation();
            /*UPLOAD FILES HERE*/
            //this.files = e.originalEvent.dataTransfer.files;
            /*this.file = e.originalEvent.dataTransfer.files[0];*/
            let file = e.originalEvent.dataTransfer.files[0];
            let fileName = file.name;
            let isMain = false; //Main file of Skecth.
            jQueryInstance.upload(fileName, file, isMain, this.allowedDetailFileTypes, false);
          }
        }
      }
    );

  }

  serviceCustomers() {
    const data = {
      zones: this.storageService.getGrupId().zoneIds,
      salesExecutives: this.storageService.getGrupId().salesExecutiveGroupIds
    }
    this.customerService.getCustomersZone(data).subscribe(
      (response) => {
        if(response) {
          if (response.status) {
            this.customers = response.data;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        } else {
          this.translate.stream('general.msgDetailResponse').subscribe((res: string) => {
            this.messageService.add({ severity: 'info', summary: 'Info', detail: res });
          });
        }
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
      () => { }
    );
  }

  getDesigners(groupLineId: number): void {
    const body = {
      "groupLineId": groupLineId
    }
    this.masterProductService.getSketchArtistPost(body).subscribe(
      (response) => {
        if(response) {
          if (response.status) {
            this.designers = response.data;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        } else {
          this.translate.stream('general.msgDetailResponse').subscribe((res: string) => {
            this.messageService.add({ severity: 'info', summary: 'Info', detail: res });
          });
        }
      },
      (error) => {
        if(error.data = [])
        {
          this.designers=[];
        }else{
         this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
        }
      },
      () => { }
    );
  }

}

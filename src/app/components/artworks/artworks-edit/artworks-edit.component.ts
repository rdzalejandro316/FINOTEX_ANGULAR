import { DatePipe } from '@angular/common';
import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtworksService } from 'src/app/core/services/artworks/artworks.service';
import { BrandService } from 'src/app/core/services/brand/brand.service';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { MasterProductService } from 'src/app/core/services/masterProduct/master-product.service';
import { ProfilesService } from 'src/app/core/services/profile/profiles.service';
import { SketchService } from 'src/app/core/services/sketch/sketch.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/public_api';
import { FileUpload } from 'src/app/shared/models/fileUpload';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-artworks-edit',
  templateUrl: './artworks-edit.component.html',
  styleUrls: ['./artworks-edit.component.css'],
  providers: [MessageService, DatePipe],
})
export class ArtworksEditComponent implements OnInit, AfterContentInit {
  titlePage = '';
  description = '';
  subscription: Subscription;
  registerFormComment: FormGroup;
  registerFormDetails: FormGroup;

  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.ArtWorks', url: '/home/artworks_history' },
    {
      label: 'menu.EditArtwork',
      url: '/home/artworks_edit/add',
      current: true,
    },
  ];

  commentSketchResponse: any = {};
  productType = [];
  cutTypes = [];
  displayConfirmComment: boolean = false;
  indicatorCommentPublic = true;
  display: boolean = false;
  hideErrorType: boolean;
  hideErrorSize: boolean;
  displayInvalidateFileMessage: boolean;
  fileList: FileUpload[] = new Array<FileUpload>();
  displayCutType = false;
  sketchSelect: any = {};
  sketchStatusId = 0;
  createdByUser = '';
  substractType = [];
  file: any;
  maxSize: string;
  buttonState = false;
  displayConfirmApproved: boolean = false;
  customers = [];
  indicatorCustomer = false;
  listStatus = [];
  designers = [];
  sketchId = 0;
  acceptallowedFileTypes: string;
  acceptallowedDetailFileTypes: string;
  acceptallowedDesignerFileTypes: string;

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
  ];

  allowedDetailFileTypes = [
    'application/vnd.ms-excel',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  allowedDesignerFileTypes = ['application/pdf'];

  validateRolBuilderSalesExecutive =
    this.profilesService.validateRolBuilderSalesExecutive();

  constructor(
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private sketchService: SketchService,
    private masterProductService: MasterProductService,
    public datepipe: DatePipe,
    private router: Router,
    private customerService: CustomerService,
    private profilesService: ProfilesService,
    private brandService: BrandService,
    private artworksService: ArtworksService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.configUploadFiles();
    this.getFormComment();
    this.getFormEdit();
    this.acceptallowedFileTypes = this.allowedFileTypes.join(',');
    this.acceptallowedDetailFileTypes = this.allowedDetailFileTypes.join(',');
    this.acceptallowedDesignerFileTypes =
      this.allowedDesignerFileTypes.join(',');
    this.displayInvalidateFileMessage = false;

    this.subscription = this.activatedRoute.paramMap.subscribe((params) => {
      let sketchId = params.get('sketchId');
      this.getDataDetail(sketchId);
    });
  }

  ngAfterContentInit(): void {
    this.subscription = this.activatedRoute.paramMap.subscribe((params) => {
      let sketchId = params.get('sketchId');
      this.getDataArtwork(sketchId);
    });
  }

  getDataDetail(sketchId: any): void {
    const data = {
      sketchId: sketchId,
    };
    this.sketchService.SketchGetById(data).subscribe(
      (response) => {
        if (response.status) {
          if (!this.profilesService.validateUserType()) {
            this.serviceCustomers(response.data);
            this.getStatusFilter(response.data);
            this.getDesigners(response.data);
            this.indicatorCustomer = true;
          }
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

  getFormEdit() {
    return (this.registerFormDetails = this.formBuilder.group({
      description: ['', Validators.required],
      GroupLine: ['', Validators.required],
      dimensions: ['', Validators.required],
      colors: ['', Validators.required],
      cut_type: ['', Validators.required],
      cutId: ['', Validators.required],
      substrate_type_list: ['', Validators.required],
      fabric_type: ['', Validators.required],
      observations: ['', Validators.nullValidator],
      UploadArtFile: ['', Validators.nullValidator],
      UploadAditional: ['', Validators.nullValidator],
      sketchStatusId: ['', Validators.required],
      designer_list: ['', Validators.nullValidator],
      CustomerId: ['', Validators.nullValidator],
      designerId: ['', Validators.nullValidator],
      UploadDesigner: ['', Validators.nullValidator],
    }));
  }

  getFormComment() {
    return (this.registerFormComment = this.formBuilder.group({
      sketchId: { value: null, disabled: true },
      description: { value: null, disabled: true },
      sketchStatusId: ['', Validators.nullValidator],
      businessId: ['', Validators.nullValidator],
      language: ['', Validators.nullValidator],
      createdByUser: ['', Validators.nullValidator],
      observation: ['', Validators.required],
      sketchObservationId: ['', Validators.nullValidator],
      public: ['', Validators.nullValidator],
      typeComment: ['', Validators.nullValidator],
    }));
  }

  showPanelDialog() {
    this.display = true;
    this.registerFormComment.reset();
    this.registerFormComment.patchValue({
      sketchId: this.sketchSelect.sketchId ? this.sketchSelect.sketchId : '',
      description: this.sketchSelect.sketchName,
    });
    this.sketchStatusId = this.sketchSelect.sketchStatusId;
    this.createdByUser = this.sketchSelect.createdByUser;
    this.description = this.sketchSelect.sketchName;
    this.registerFormComment.get('public').setValue('1');
    if (this.profilesService.validateUserType()) {
      this.indicatorCommentPublic = false;
    }
  }

  onSubmitCommet(): void {
    this.display = false;
    const user = this.storageService.getUser();
    this.createdByUser = user.username;
    this.registerFormComment.patchValue({
      sketchObservationId: 0,
      public:
        this.registerFormComment.get('public').value == '1' ? true : false,
      createdByUser: this.createdByUser,
      sketchStatusId: this.sketchStatusId,
    });

    this.sketchService
      .saveCommentSketch(this.registerFormComment.getRawValue())
      .subscribe(
        (response) => {
          if (response.status) {
            this.displayConfirmComment = true;
            this.commentSketchResponse = response.data;
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

  closeCommentConfirmation(): void {
    this.displayConfirmComment = false;
  }

  changeGroupLine(event: any) {
    this.registerFormDetails.patchValue({
      cut_type: null,
      cutId: null,
      substrate_type_list: null,
    });

    this.getSubstrateTypeService(event.value, 'new');
  }

  openModalCutType() {
    this.cutTypes = [];
    this.displayCutType = true;
    this.getCutType(this.registerFormDetails.get('GroupLine').value);
  }

  getCutType(idGrupLine: number) {
    const body = {
      idGroupLine: idGrupLine,
    };
    this.artworksService.GetCut(body).subscribe(
      (response) => {
        if (response.status) {
          this.cutTypes = response.data;

          let objCut = this.cutTypes.find((obj) => {
            return obj.cutId === this.sketchSelect.cutId;
          });
          this.registerFormDetails.patchValue({
            CustomerId: this.sketchSelect.customerId,
            description: this.sketchSelect.sketchName,
            GroupLine: this.sketchSelect.groupLineId,
            dimensions: this.sketchSelect.unitMeasures,
            colors: this.sketchSelect.color,
            cut_type: objCut ? objCut.cutName : '',
            cutId: objCut ? objCut.cutId : '',
            fabric_type: this.sketchSelect.fabricType,
            observations: this.sketchSelect.observation,
            sketchStatusId: this.sketchSelect.sketchStatusId,
            designer_list: this.sketchSelect.designerId,
          });

          this.getSubstrateTypeService(this.sketchSelect.groupLineId, 'edit');
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

  getGroupLineService(): void {
    this.masterProductService.getGroupLine().subscribe(
      (response) => {
        if (response.status) {
          this.productType = response.data;
          this.getCutType(this.sketchSelect.groupLineId);
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

  getSubstrateTypeService(GroupLine: number, action: string): void {
    const datos = {
      substrateId: 0,
      groupLineId: GroupLine,
    };
    this.artworksService.getSubstractByGroupLine(datos).subscribe(
      (response) => {
        if (response.status) {
          this.substractType = response.data;
          if (action == 'edit') {
            this.registerFormDetails.patchValue({
              substrate_type_list: this.sketchSelect.substrateId,
            });
          }
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

  selectCutType() {
    const cutTypeName = Number($("input[name='rdCutType']:checked").val());
    if (cutTypeName) {
      let objCut = this.cutTypes.find((obj) => {
        return obj.cutId === cutTypeName;
      });
      this.registerFormDetails.patchValue({
        cut_type: objCut.cutName,
        cutId: objCut.cutId,
      });
      this.displayCutType = false;
    }
  }

  public resetFiles(isMain: string) {
    if (isMain == 'file') {
      this.registerFormDetails.patchValue({
        UploadArtFile: '',
      });
    } else if (isMain == 'addFile') {
      this.registerFormDetails.patchValue({
        UploadAditional: '',
      });
    } else if (isMain == 'designer') {
      this.registerFormDetails.patchValue({
        UploadDesigner: '',
      });
    }

    this.fileList.forEach((item, index) => {
      if (isMain == 'file') {
        if (item.isMain) {
          this.fileList.splice(index, 1);
        }
      }

      if (isMain == 'addFile') {
        if (!item.isMain && !item.IsDesignerFile) {
          this.fileList.splice(index, 1);
        }
      }

      if (isMain == 'designer') {
        if (item.IsDesignerFile) {
          this.fileList.splice(index, 1);
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

  async fileChangedDesigner(e) {
    this.file = e.target.files[0];
    await this.upload(
      this.file.name,
      this.file,
      false,
      this.allowedDesignerFileTypes,
      true
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

  clickArtFile() {
    $('#fileArtFile').click();
  }

  clickArtFileAditional() {
    $('#fileArtFileAditional').click();
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
          //this.files = e.originalEvent.dataTransfer.files;
          /*this.file = e.originalEvent.dataTransfer.files[0];*/
          let file = e.originalEvent.dataTransfer.files[0];
          let fileName = file.name;
          let isMain = false; //Main file of Skecth.
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
    _fileName: string,
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
      };
      self.fileList.push(fileFU);
      self.updateFileList(isMain, isDesigner);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  updateFileList(isMain, isDesigner) {
    let filesUpload: string = '';
    this.fileList.forEach((item, _index) => {
      if (item.IsDesignerFile == isDesigner) {
        filesUpload = item.fileName;
      } else {
        if (item.isMain == isMain && !isDesigner) {
          filesUpload = item.fileName;
        }
      }
    });

    if (isMain) {
      this.registerFormDetails.controls.UploadArtFile.setValue(filesUpload);
    } else {
      if (isDesigner) {
        this.registerFormDetails.controls.UploadDesigner.setValue(filesUpload);
      } else {
        this.registerFormDetails.controls.UploadAditional.setValue(filesUpload);
      }
    }
  }

  getDataArtwork(sketchId: any): void {
    const data = {
      sketchId: sketchId,
    };
    this.sketchService.SketchGetById(data).subscribe(
      (response) => {
        if (response.status) {
          this.sketchSelect = response.data;
          let designerImages = [];
          let artImages = [];
          let aditionalImages = [];
          this.getGroupLineService();
          if (this.sketchSelect.sketchFiles) {
            for (let image of this.sketchSelect.sketchFiles) {
              if (image.isDesignerFile) {
                designerImages.push(image.fileName);
              } else {
                if (image.isMain) {
                  artImages.push(image.fileName);
                } else {
                  aditionalImages.push(image.fileName);
                }
              }
            }
          }
          if (this.sketchSelect.sketchFiles) {
            this.fileList = this.sketchSelect.sketchFiles;
          }
          this.registerFormDetails.controls.UploadArtFile.setValue(
            artImages.join(';')
          );
          this.registerFormDetails.controls.UploadAditional.setValue(
            aditionalImages.join(';')
          );
          this.registerFormDetails.controls.UploadDesigner.setValue(
            designerImages.join(';')
          );
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

  downloadFileDesigner() {
    let designerImages: Array<any> = [];
    if (this.sketchSelect.sketchFiles) {
      for (let image of this.sketchSelect.sketchFiles) {
        if (image.isDesignerFile) {
          designerImages.push(image);
        }
      }
    }
    this.downloadFile(designerImages[0]);
  }

  downloadFileArtwork() {
    let artImages: Array<any> = [];
    for (let image of this.sketchSelect.sketchFiles) {
      if (image.isMain && !image.isDesignerFile) {
        artImages.push(image);
      }
    }
    this.downloadFile(artImages[0]);
  }

  downloadFileAditional() {
    let aditionalImages: Array<any> = [];

    for (let image of this.sketchSelect.sketchFiles) {
      if (!image.isMain && !image.isDesignerFile) {
        aditionalImages.push(image);
      }
    }
    this.downloadFile(aditionalImages[0]);
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

  editArtwork() {
    moment.locale(this.storageService.getLanguage());
    this.buttonState = true;
    let latestDate = moment().format();
    const user = this.storageService.getUser();

    let sketch = {};

    if (!this.profilesService.validateUserType()) {
      sketch = {
        SketchId: this.sketchSelect.sketchId,
        companyId: 1,
        customerId: this.registerFormDetails.get('CustomerId').value,
        sketchName: this.registerFormDetails.get('description').value,
        groupLineId: this.registerFormDetails.get('GroupLine').value,
        creationDate: this.sketchSelect.creationDate,
        sketchStatusId: this.registerFormDetails.get('sketchStatusId').value,
        unitMeasures: this.registerFormDetails.get('dimensions').value,
        color: this.registerFormDetails.get('colors').value,
        cutId: this.registerFormDetails.get('cutId').value,
        substrateId: this.registerFormDetails.get('substrate_type_list').value,
        fabricType: this.registerFormDetails.get('fabric_type').value,
        observation: this.registerFormDetails.get('observations').value,
        designerId: this.registerFormDetails.get('designerId').value,
        createdByUser: this.sketchSelect.createdByUser,
        modifiedByUser: user.username,
        modifiedDate: latestDate,
        sketchFiles: this.fileList,
      };
    } else {
      sketch = {
        SketchId: this.sketchSelect.sketchId,
        companyId: 1,
        customerId: this.sketchSelect.customerId,
        sketchName: this.registerFormDetails.get('description').value,
        groupLineId: this.registerFormDetails.get('GroupLine').value,
        creationDate: this.sketchSelect.creationDate,
        sketchStatusId: this.sketchSelect.sketchStatusId,
        unitMeasures: this.registerFormDetails.get('dimensions').value,
        color: this.registerFormDetails.get('colors').value,
        cutId: this.registerFormDetails.get('cutId').value,
        substrateId: this.registerFormDetails.get('substrate_type_list').value,
        fabricType: this.registerFormDetails.get('fabric_type').value,
        observation: this.registerFormDetails.get('observations').value,
        designerId: this.sketchSelect.designerId,
        createdByUser: this.sketchSelect.createdByUser,
        modifiedByUser: user.username,
        modifiedDate: latestDate,
        sketchFiles: this.fileList,
      };
    }

    this.sketchService.UpdateSketch(sketch).subscribe(
      (response) => {
        if (response.status) {
          this.displayConfirmApproved = true;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message,
          });
          this.buttonState = false;
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

  confirmApproved() {
    this.displayConfirmApproved = true;
    this.router.navigate(['home/artworks_details', this.sketchSelect.sketchId]);
  }

  serviceCustomers(sketch: any): void {
    const data = {
      zones: this.storageService.getGrupId().zoneIds,
      salesExecutives: this.storageService.getGrupId().salesExecutiveGroupIds,
    };
    this.customerService.getCustomersZone(data).subscribe(
      (response) => {
        if (response.status) {
          this.customers = response.data;
          this.registerFormDetails.controls.CustomerId.setValue(
            sketch.customerId
          );
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

  getStatusFilter(skecht: any): void {
    this.sketchService.getAllStatusSketch().subscribe(
      (response) => {
        this.listStatus = response.data;
        this.registerFormDetails.controls.sketchStatusId.setValue(
          skecht.sketchStatusId
        );
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

  getDesigners(skecht: any): void {
    const body = {
      groupLineId: skecht.groupLineId,
    };
    this.masterProductService.getSketchArtistPost(body).subscribe(
      (response) => {
        if (response.status) {
          this.designers = response.data;
          this.registerFormDetails.controls.designerId.setValue(
            skecht.designerId
          );
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
}

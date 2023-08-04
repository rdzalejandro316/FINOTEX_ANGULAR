import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilesService } from 'src/app/core/services/profile/profiles.service';
import { SketchService } from 'src/app/core/services/sketch/sketch.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { FileUpload } from 'src/app/shared/models/fileUpload';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-artworks-details',
  templateUrl: './artworks-details.component.html',
  styleUrls: ['./artworks-details.component.css'],
  providers: [MessageService, DatePipe],
})
export class ArtworksDetailsComponent implements OnInit {
  registerFormComment: FormGroup;
  registerFormDetails: FormGroup;
  registerFormDecline: FormGroup;
  subscription: Subscription;
  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.ArtWorks', url: '/home/artworks_history' },
    {
      label: 'menu.ArtworkDetails',
      url: '/home/artworks_details/add',
      current: true,
    },
  ];

  displayCommnet = false;
  historyArtwork = [];
  language = 'en';
  artworkDetailImagen: any;
  indicatorCommentPublic = true;
  sketchStatusId = 0;
  createdByUser = '';
  description = '';
  commentSketchResponse: any = {};
  displayConfirmComment: boolean = false;
  decliningReasons = [];
  displayDecline = false;
  displayDeclined = false;
  displayApprove = false;
  title_dialog_generi = '';
  subTitle_dialog_generi = '';
  indicatorCustomer = false;
  col_md = 'col-md-6';
  fileList: FileUpload[] = new Array<FileUpload>();
  sketchSelect: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private storageService: StorageService,
    private sketchService: SketchService,
    private router: Router,
    private profilesService: ProfilesService,
    public datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getFormDetail();
    this.getDisabled();
    this.getFormComment();
    this.getFormDecline();

    if (!this.profilesService.validateUserType()) {
      this.indicatorCustomer = true;
      this.col_md = 'col-md-3';
    }
    this.subscription = this.route.paramMap.subscribe((params) => {
      let sketchId = params.get('sketchId');
      this.getDataDetail(sketchId);
    });
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

  getFormDecline() {
    return (this.registerFormDecline = this.formBuilder.group({
      declining_reason: ['', Validators.required],
    }));
  }

  getFormDetail() {
    return (this.registerFormDetails = this.formBuilder.group({
      description: ['', Validators.nullValidator],
      product_type: ['', Validators.nullValidator],
      creationDate: ['', Validators.nullValidator],
      artwork_status: ['', Validators.nullValidator],
      dimensions: ['', Validators.nullValidator],
      colors: ['', Validators.nullValidator],
      cut_type: ['', Validators.nullValidator],
      substrate_type: ['', Validators.nullValidator],
      fabric_type: ['', Validators.nullValidator],
      observations: ['', Validators.nullValidator],
      art_file: ['', Validators.nullValidator],
      additional_details_file: ['', Validators.nullValidator],
      designer_file: ['', Validators.nullValidator],
      designer: ['', Validators.nullValidator],
      customer: ['', Validators.nullValidator],
    }));
  }

  getDisabled() {
    this.registerFormDetails.get('description').disable();
    this.registerFormDetails.get('product_type').disable();
    this.registerFormDetails.get('creationDate').disable();
    this.registerFormDetails.get('artwork_status').disable();
    this.registerFormDetails.get('dimensions').disable();
    this.registerFormDetails.get('colors').disable();
    this.registerFormDetails.get('cut_type').disable();
    this.registerFormDetails.get('substrate_type').disable();
    this.registerFormDetails.get('fabric_type').disable();
    this.registerFormDetails.get('observations').disable();
    this.registerFormDetails.get('art_file').disable();
    this.registerFormDetails.get('additional_details_file').disable();
    this.registerFormDetails.get('designer_file').disable();
    this.registerFormDetails.get('designer').disable();
    this.registerFormDetails.get('customer').disable();
  }

  getDataDetail(sketchId: any): void {
    const data = {
      sketchId: sketchId,
    };
    this.sketchService.SketchGetById(data).subscribe(
      (response) => {
        if (response.status) {
          this.sketchSelect = response.data;
          this.setDataDetail(response.data);
          this.artworkDetailImagen = response.data;
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

  setDataDetail(data: any) {
    moment.locale(this.storageService.getLanguage());
    let creationDate = data.creationDate
      ? moment(data.creationDate, 'YYYY-MM-DD').format('MMM/DD/YYYY')
      : null;
    let designerImages = [];
    let artImages = [];
    let aditionalImages = [];
    if (data.sketchFiles) {
      for (let image of data.sketchFiles) {
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

    this.registerFormDetails.patchValue({
      customer: data.customerName,
      description: data.sketchName,
      product_type: data.groupLineName,
      creationDate: creationDate,
      artwork_status: data.sketchStatusName,
      dimensions: data.unitMeasures,
      colors: data.color,
      cut_type: data.cutName,
      substrate_type: data.substrateName,
      fabric_type: data.fabricType,
      observations: data.observation,
      art_file: artImages.join(';'),
      additional_details_file: aditionalImages.join(';'),
      designer_file: designerImages.join(';'),
      designer: data.designerName,
    });
    this.getProcessHistory();
  }

  showPanelDialog(): void {
    this.displayCommnet = true;
    this.registerFormComment.reset();
    this.registerFormComment.patchValue({
      sketchId: this.sketchSelect.sketchId,
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

  downloadFileArtwork() {
    if (
      this.artworkDetailImagen.sketchFiles !== null &&
      this.artworkDetailImagen.sketchFiles !== undefined
    ) {
      let artImages: Array<any> = [];
      for (let image of this.artworkDetailImagen.sketchFiles) {
        if (image.isMain && !image.isDesignerFile) {
          artImages.push(image);
        }
      }
      this.downloadFile(artImages[0]);
    }
  }

  downloadFileAditional(): void {
    if (
      this.artworkDetailImagen.sketchFiles !== null &&
      this.artworkDetailImagen.sketchFiles !== undefined
    ) {
      let aditionalImages: Array<any> = [];
      for (let image of this.artworkDetailImagen.sketchFiles) {
        if (!image.isMain && !image.isDesignerFile) {
          aditionalImages.push(image);
        }
      }
      this.downloadFile(aditionalImages[0]);
    }
  }

  downloadFileDesigner(): void {
    if (
      this.artworkDetailImagen.sketchFiles !== null &&
      this.artworkDetailImagen.sketchFiles !== undefined
    ) {
      let designerlImages: Array<any> = [];
      for (let image of this.artworkDetailImagen.sketchFiles) {
        if (image.isDesignerFile) {
          designerlImages.push(image);
        }
      }
      this.downloadFile(designerlImages[0]);
    }
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

  declineDialog(): void {
    this.displayDecline = true;
    this.SketchRejectionGet();
  }

  updateSkectchStatus(parameterStatus): void {
    if (parameterStatus != 'approved') {
      this.displayDecline = false;
    }
    const user = this.storageService.getUser();
    const data = {
      sketchId: this.sketchSelect.sketchId,
      sketchStatusId: parameterStatus == 'approved' ? 8 : 9,
      sketchRejectionId:
        parameterStatus == 'decline'
          ? this.registerFormDecline.get('declining_reason').value
          : null,
      modifiedByUser: user.username,
    };

    this.sketchService.UpdateSketchStatus(data).subscribe(
      (response) => {
        if (response.status) {
          if (parameterStatus == 'approved') {
            this.displayApprove = true;
          } else {
            this.displayDeclined = true;
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
      () => { }
    );
  }

  getProcessHistory() {
    const data = {
      sketchId: this.sketchSelect.sketchId,
    };
    this.sketchService.SketchObservationHistoryGetBySketchId(data).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.historyArtwork = response.data;

          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
        }
      },
      (error) => {
        if (error.status != 400) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        }
      },
      () => { }
    );
  }

  onSubmitCommet(): void {
    this.displayCommnet = false;
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
        () => { }
      );
  }

  closeCommentConfirmation(): void {
    this.displayConfirmComment = false;
  }

  SketchRejectionGet() {
    const data = {};
    this.sketchService.SketchRejectionGet(data).subscribe(
      (response) => {
        this.decliningReasons = response.data;
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

  confirmApproved() {
    this.displayApprove = false;
    this.router.navigate(['home/artworks_history']);
  }

  confirmDeclined() {
    this.displayDeclined = false;
    this.router.navigate(['home/artworks_history']);
  }

  showEdit() {
    this.router.navigate(['home/artworks_edit', this.sketchSelect.sketchId]);
  }

  setFormatDate(dateArtwork: string) : string {
    return moment(dateArtwork, 'YYYY-MM-DD').format('MMM/DD/YYYY');
  }
}

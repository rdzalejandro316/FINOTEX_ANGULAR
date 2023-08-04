import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MasterProductService } from 'src/app/core/services/masterProduct/master-product.service';
import { TechinicalService } from 'src/app/core/services/technical-sheets/techinical.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/public_api';
import { FormProvider } from '../form-provider';
import { ProductService } from 'src/app/core/services/product/product.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { RolesEnum } from '../models/role.enum';
import { SalesService } from 'src/app/core/services/sales/sales.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-identification-data',
  templateUrl: './identification-data.component.html',
  styleUrls: ['./identification-data.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class IdentificationDataComponent implements OnInit, AfterViewChecked {
  @Input() paramCustomerId: string = '';
  @Output() paramLineId = new EventEmitter<number>();
  @Output() paramLongProduction = new EventEmitter<number>();
  @Output() dataCompleteForm = new EventEmitter<FormGroup>();
  @ViewChild('Longproduction') myInputField: ElementRef;
  @Input() productId: any = '';
  private RolesEnum = RolesEnum;
  registerFormSesionTwo: FormGroup;

  formOneIconStatusTwo = 2;
  formOneStatusTextTwo = '';

  ListLine = [];
  ListSubline = [];
  ListQuality = [];
  ListUrdimbre = [];
  ListShape = [];
  ListBroad = [];
  ListFinish = [];
  ListAdhesive = [];
  ListApplication = [];
  ListNumberColors = [];
  ListNumberStickers = [];
  ListNumberPapers = [];
  ListNumberAccessories = [];
  ListNumberFinishes = [];
  ListAuxiliaryNumbers = [];
  ListReductiveNumbers = [];
  errorMessageText: string = '';

  Technical_origin: boolean;
  WMS_barcode: boolean;
  Urdimbre: boolean;
  Shape: boolean;
  Commercial_length: boolean;
  Length_front: boolean;
  Finish: boolean;
  Adhesive: boolean;
  Number_accessories: boolean;
  Reductive_numbers: boolean;
  Number_papers: boolean;
  Number_finishes: boolean;
  Auxiliary_numbers: boolean;
  Size: boolean;
  Number_stickers: boolean;
  Application: boolean;
  Quality: boolean;
  Number_colors: boolean;
  Broad: boolean;
  Long_production: boolean;
  itemProductIdCode: string = '';

  public rolepermission;
  public KEYPERMISSION_ROLE: string = 'identification-data';
  public href: string = '';
  public details: boolean = false;
  public statusForm: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private translate: TranslateService,
    private techinicalService: TechinicalService,
    private masterProductService: MasterProductService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private formProvider: FormProvider,
    private productService: ProductService,
    private _storageService: StorageService,
    private sales: SalesService,
    private router: Router
  ) {}

  autoFocusLongproduction() {
    this.myInputField.nativeElement.focus();
  }

  ngOnInit(): void {
    this.showAllFieldsValidatorView();
    this.getFormSessionTwo();
    this.readactiondetail();
    this.readactionedit();
    this.validateFormStatus();
    this.shapeTypeGetService();
    this.applicationGetService();
    this.setDataDropdown();
    this.translate
      .stream('technical-sheets.validateInternalProductCode')
      .subscribe((res: string) => {
        this.errorMessageText = res;
      });
    this.registerFormSesionTwo.statusChanges.subscribe((res) => {
      if (res == 'VALID') {
        this.dataComplete();
      }
    });
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  validateFormStatus(): void {
    this.formOneIconStatusTwo =
      this.registerFormSesionTwo.valid == true ? 1 : 2;
    this.formOneStatusTextTwo =
      this.registerFormSesionTwo.valid == true
        ? 'technical-sheets.session_form_completed'
        : 'technical-sheets.session_form_without_completed';

    this.registerFormSesionTwo.valueChanges.subscribe((value) => {
      this.formOneIconStatusTwo =
        this.registerFormSesionTwo.valid == true ? 1 : 2;
      this.formOneStatusTextTwo =
        this.registerFormSesionTwo.valid == true
          ? 'technical-sheets.session_form_completed'
          : 'technical-sheets.session_form_without_completed';
    });
  }

  parameterCheckAutomaticCode(indicator: boolean): void {
    if (indicator) {
      this.customerProductPrefixGetByCustomerIdService(this.paramCustomerId);
    } else {
      this.registerFormSesionTwo.patchValue({
        Item_code: null,
        Origin_code: null,
        Technical_origin: null,
        WMS_barcode: null,
      });
      this.registerFormSesionTwo.get('Item_code').enable();
      this.registerFormSesionTwo.get('Item_code').updateValueAndValidity();
    }
  }

  receiveParameterProductId(productId: any) {
    let data = {
      productId: productId,
    };
    this.productService.getProductByProductId(data).subscribe(
      (response) => {
        if (response && response.status) {
          this.paramLineId.emit(response.data.lineId);
          this.showAndHideFields(response.data.lineId, true);
          this.informationFillingDropdown(
            response.data.lineId,
            response.data.qualityId
          );
          this.paramLongProduction.emit(response.data.productionLenght);
          this.itemProductIdCode = response.data.productId.trim();
          this.registerFormSesionTwo.patchValue({
            Item_code: response.data.productId.trim(),
            Origin_code: response.data.sourceProductId.trim(),
            Technical_origin: response.data.technicalProductId.trim(),
            WMS_barcode: this.barcodeFormat(response.data.productId.trim()),
            Item_name: response.data.productName,
            Line: response.data.lineId,
            Subline: response.data.subLineId,
            Quality: response.data.qualityId,
            Urdimbre: response.data.warpId,
            Shape: response.data.shapeTypeId,
            Broad: response.data.widthId.toFixed(2),
            Long_production: response.data.productionLenght,
            Commercial_length: response.data.commercialLenght,
            Length_front: response.data.fold,
            Finish: response.data.finishId,
            Adhesive: response.data.adhesiveId,
            Size: response.data.sizes,
            Application: response.data.applicationId,
            Number_colors: response.data.numberOfColors,
            Number_stickers: response.data.numberOfAdhesives,
            Number_papers: response.data.numberOfPapers,
            Number_accessories: response.data.numberOfAccessories,
            Number_finishes: response.data.numberOfColorants,
            Auxiliary_numbers: response.data.numberOfAuxiliaries,
            Reductive_numbers: response.data.numberOfReductive,
          });

          this.validateFormStatus();
          //this.dataComplete();
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
      }
    );
  }

  receiveParameterProductionPlan(paramProductionPlanId: number) {
    const data = { plantId: paramProductionPlanId };
    this.techinicalService.productionPlanGet(data).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.ListLine = response.data;
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
      () => {}
    );
  }

  getFormSessionTwo(): FormGroup {
    return (this.registerFormSesionTwo = this.formBuilder.group({
      Item_code: [
        '',
        [Validators.required, Validators.pattern('^[A-z]+[0-9]+$')],
      ],
      Origin_code: { value: null, disabled: true },
      Technical_origin: { value: null, disabled: true },
      WMS_barcode: ['', Validators.required],
      Item_name: ['', Validators.required],
      Line: ['', Validators.required],
      Subline: ['', Validators.required],
      Quality: ['', Validators.required],
      Urdimbre: ['', Validators.required],
      Shape: ['', Validators.required],
      Broad: ['', Validators.required],
      Long_production: [
        '',
        [Validators.required, Validators.pattern(/^([0-9]{1,9})$/)],
      ],
      Commercial_length: [
        '',
        [Validators.required, Validators.pattern(/^([0-9]{1,9})$/)],
      ],
      Length_front: [
        '',
        [Validators.required, Validators.pattern(/^([0-9]{1,9})$/)],
      ],
      Finish: ['', Validators.required],
      Adhesive: ['', Validators.required],
      Size: ['', Validators.required],
      Application: ['', Validators.required],
      Number_colors: [0, Validators.required],
      Number_stickers: [0, Validators.required],
      Number_papers: [0, Validators.required],
      Number_accessories: [0, Validators.required],
      Number_finishes: [0, Validators.required],
      Auxiliary_numbers: [0, Validators.required],
      Reductive_numbers: [0, Validators.required],
    }));
  }

  showAllFieldsValidatorView(): void {
    this.Technical_origin = true;
    this.WMS_barcode = true;
    this.Urdimbre = true;
    this.Shape = true;
    this.Commercial_length = true;
    this.Length_front = true;
    this.Finish = true;
    this.Adhesive = true;
    this.Number_accessories = true;
    this.Reductive_numbers = true;
    this.Number_papers = true;
    this.Number_finishes = true;
    this.Auxiliary_numbers = true;
    this.Size = true;
    this.Number_stickers = true;
    this.Application = true;
    this.Quality = true;
    this.Number_colors = true;
    this.Broad = true;
    this.Long_production = true;
  }

  showAllFieldsValidatorRequire(): void {
    const listNotRequired = [
      {
        name: 'Technical_origin',
        require: Validators.required,
      },
      {
        name: 'WMS_barcode',
        require: Validators.required,
      },
      {
        name: 'Urdimbre',
        require: Validators.required,
      },
      {
        name: 'Shape',
        require: Validators.required,
      },
      {
        name: 'Commercial_length',
        require: Validators.required,
      },
      {
        name: 'Length_front',
        require: Validators.required,
      },
      {
        name: 'Finish',
        require: Validators.required,
      },
      {
        name: 'Adhesive',
        require: Validators.required,
      },
      {
        name: 'Number_accessories',
        require: Validators.required,
      },
      {
        name: 'Reductive_numbers',
        require: Validators.required,
      },
    ];
    this.showFormFields(listNotRequired);
  }

  showAllFieldsValidatorRequireImproved(): void {
    const listNotRequired = [
      {
        name: 'Technical_origin',
        require: Validators.required,
      },
      {
        name: 'WMS_barcode',
        require: Validators.required,
      },
      {
        name: 'Broad',
        require: Validators.required,
      },
      {
        name: 'Long_production',
        require: Validators.required,
      },
      {
        name: 'Quality',
        require: Validators.required,
      },
      {
        name: 'Urdimbre',
        require: Validators.required,
      },
      {
        name: 'Shape',
        require: Validators.required,
      },
      {
        name: 'Commercial_length',
        require: Validators.required,
      },
      {
        name: 'Length_front',
        require: Validators.required,
      },
      {
        name: 'Finish',
        require: Validators.required,
      },
      {
        name: 'Adhesive',
        require: Validators.required,
      },
      {
        name: 'Size',
        require: Validators.required,
      },
      {
        name: 'Application',
        require: Validators.required,
      },
      {
        name: 'Number_colors',
        require: Validators.required,
      },
      {
        name: 'Number_stickers',
        require: Validators.required,
      },
      {
        name: 'Number_papers',
        require: Validators.required,
      },
      {
        name: 'Number_accessories',
        require: Validators.required,
      },
      {
        name: 'Number_finishes',
        require: Validators.required,
      },
      {
        name: 'Auxiliary_numbers',
        require: Validators.required,
      },
      {
        name: 'Reductive_numbers',
        require: Validators.required,
      },
    ];
    this.showFormFields(listNotRequired);
  }

  showFormFields(data: any[]): void {
    data.forEach((currentValue, index) => {
      this.registerFormSesionTwo
        .get(currentValue.name)
        .setValidators([currentValue.require]);
      this.registerFormSesionTwo
        .get(currentValue.name)
        .updateValueAndValidity();
    });
  }

  customerProductPrefixGetByCustomerIdService(customerId: any): void {
    const data = { customerId: customerId };
    this.techinicalService.customerProductPrefixGetByCustomerId(data).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.registerFormSesionTwo.patchValue({
              Item_code: response.data.consecutiveCode,
              Origin_code: response.data.consecutiveCode,
              Technical_origin: response.data.consecutiveCode,
              WMS_barcode: this.barcodeFormat(response.data.consecutiveCode),
            });
            this.registerFormSesionTwo.get('Item_code').disable();
            this.registerFormSesionTwo
              .get('Item_code')
              .updateValueAndValidity();

            this.registerFormSesionTwo.get('WMS_barcode').disable();
            this.registerFormSesionTwo
              .get('WMS_barcode')
              .updateValueAndValidity();
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
      () => {}
    );
  }

  lineGetService(): void {
    this.techinicalService.lineGet().subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.ListLine = response.data;
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
      () => {}
    );
  }

  colourGetService(lineId: number): void {
    const data = { lineId: lineId };
    this.techinicalService.WarpLineByLineGet(data).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.ListUrdimbre = response.data;
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
      () => {}
    );
  }

  shapeTypeGetService(): void {
    this.techinicalService.shapeTypeGet().subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.ListShape = response.data;
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
      () => {}
    );
  }

  applicationGetService(): void {
    this.techinicalService.applicationGet().subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.ListApplication = response.data;
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
      () => {}
    );
  }

  changeLine(event: any): void {
    this.changeLineCode(event.value);
  }

  changeLineCode(line: any, quality: number = 0): void {
    this.informationFillingDropdown(line, quality);
    this.showAndHideFields(line);
    this.paramLineId.emit(line);
    this.registerFormSesionTwo.patchValue({ Long_production: '' });
  }

  informationFillingDropdown(lineId: number, quality: number = 0): void {
    this.subLineGetByLineIdService(lineId);
    this.qualityLineGetByLineIdService(lineId, quality);
    this.widthLineGetByLineIdService(lineId);
    this.finishLineGetByLineIdService(lineId);
    this.adhesiveLineGetByLineIdService(lineId);
    this.colourGetService(lineId);
  }

  subLineGetByLineIdService(lineId: number): void {
    const data = { lineId: lineId };
    this.techinicalService.subLineGetByLineId(data).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.ListSubline = response.data;
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
      () => {}
    );
  }

  qualityLineGetByLineIdService(
    lineId: number,
    selectedQualityId: number = 0
  ): void {
    const data = { lineId: lineId };
    this.techinicalService.qualityLineGetByLineId(data).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.ListQuality = response.data;
            this.registerFormSesionTwo.controls.Quality.setValue(
              selectedQualityId
            );
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
      () => {}
    );
  }

  widthLineGetByLineIdService(lineId: number): void {
    const data = { lineId: lineId };
    this.techinicalService.widthLineGetByLineId(data).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.ListBroad = response.data.sort(
              (a, b) => a.widthId - b.widthId
            );
            this.ListBroad.forEach((element, index) => {
              this.ListBroad[index].widthName = element.widthId.split(
                '.',
                1
              )[0];
            });
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
      () => {}
    );
  }

  finishLineGetByLineIdService(lineId: number): void {
    const data = { lineId: lineId };
    this.techinicalService.finishLineGetByLineId(data).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.ListFinish = response.data;
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
      () => {}
    );
  }

  adhesiveLineGetByLineIdService(lineId: number): void {
    const data = { lineId: lineId };
    this.techinicalService.adhesiveLineGetByLineId(data).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.ListAdhesive = response.data;
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
      () => {}
    );
  }

  showAndHideFields(lineId: number, getData: boolean = false): void {
    switch (lineId) {
      // Heat transfer Rollo
      case 52:
        setTimeout(() => {
          if (!getData) {
            this.clearLineFilters();
          }

          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsHeatTransferRollo();
        }, 3);

        break;

      // Estampados
      case 66:
        setTimeout(() => {
          if (!getData) {
            this.clearLineFilters();
          }
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsPrint();
        }, 3);

        break;

      // Thermal
      case 68:
        setTimeout(() => {
          if (!getData) {
            this.clearLineFilters();
          }
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsThermal();
        }, 3);
        break;

      // Reatas y pretinas
      case 64:
        setTimeout(() => {
          if (!getData) {
            this.clearLineFilters();
          }
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsReatasPretinas();
        }, 3);
        break;

      // Orillo/Telas/Mascarillas Tejidas
      case 60:
      case 63:
      case 67:
        setTimeout(() => {
          if (!getData) {
            this.clearLineFilters();
          }
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsMascarillasTejidas();
        }, 3);
        break;

      // Textil y no textil
      case 74:
      case 76:
        setTimeout(() => {
          if (!getData) {
            this.clearLineFilters();
          }
          this.showAllFieldsValidatorRequireImproved();
          this.showAllFieldsValidatorView();
          this.showFormFieldsTextil();
        }, 3);
        break;

      // Estampación por Sublimación
      case 78:
        setTimeout(() => {
          if (!getData) {
            this.clearLineFilters();
          }
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsSublimationPrinting();
        }, 3);
        break;

      // Sintética Screen, Sintético, estampado Screen
      case 79:
      case 83:
        setTimeout(() => {
          if (!getData) {
            this.clearLineFilters();
          }
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsSyntheticScreen();
        }, 3);
        break;

      // Troquelado, Sintético Otros
      case 82:
      case 81:
      case 77:
        setTimeout(() => {
          if (!getData) {
            this.clearLineFilters();
          }
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsSyntheticScreen();
        }, 3);
        break;

      // Kits: Kit Offset, Kit Estampado + Sublimacion, Kit Orillo (pendiente Mexico)
      case 86:
      case 88:
      case 89:
        setTimeout(() => {
          if (!getData) {
            this.clearLineFilters();
          }
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsKits();
        }, 3);
        break;

      // Cortado, Kit Heat transfer, Kit Flexo (Mexico)
      case 87:
      case 91:
        setTimeout(() => {
          if (!getData) {
            this.clearLineFilters();
          }
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsKits();
        }, 3);
        break;

      //Laser
      case 84:
        setTimeout(() => {
          if (!getData) {
            this.clearLineFilters();
          }

          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsHeatTransferLaser();
        }, 3);
        break;

      case 56:
      case 75:
        setTimeout(() => {
          if (!getData) {
            this.clearLineFilters();
          }

          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsHeatTransferPiezas();
        }, 3);
        break;

      default:
        if (!getData) {
          this.clearLineFilters();
        }
        this.showAllFieldsValidatorRequire();
        this.showAllFieldsValidatorView();
        break;
    }
  }

  clearLineFilters() {
    this.registerFormSesionTwo.get('Length_front').setValue('');
    this.registerFormSesionTwo.get('Finish').setValue('');
    this.registerFormSesionTwo.get('Adhesive').setValue('');
    this.registerFormSesionTwo.get('Number_stickers').setValue(0);
    this.registerFormSesionTwo.get('Number_accessories').setValue(0);
    this.registerFormSesionTwo.get('Application').setValue('');
    this.registerFormSesionTwo.get('Reductive_numbers').setValue(0);
    this.registerFormSesionTwo.get('Technical_origin').setValue('');
    this.registerFormSesionTwo.get('WMS_barcode').setValue('');
    this.registerFormSesionTwo.get('Number_papers').setValue(0);
    this.registerFormSesionTwo.get('Urdimbre').setValue('');
    this.registerFormSesionTwo.get('Shape').setValue('');
    this.registerFormSesionTwo.get('Commercial_length').setValue('');
    this.registerFormSesionTwo.get('Quality').setValue('');
    this.registerFormSesionTwo.get('Number_finishes').setValue(0);
    this.registerFormSesionTwo.get('Auxiliary_numbers').setValue(0);
    this.registerFormSesionTwo.get('Size').setValue('');
    this.registerFormSesionTwo.get('Number_colors').setValue(0);
    this.registerFormSesionTwo.get('Long_production').setValue('');
    this.registerFormSesionTwo.get('Broad').setValue('');
  }

  showFormFieldsTextil(): void {
    const listNotRequired = [
      {
        name: 'Technical_origin',
        require: Validators.nullValidator,
      },
      {
        name: 'WMS_barcode',
        require: Validators.nullValidator,
      },
      {
        name: 'Quality',
        require: Validators.nullValidator,
      },
      {
        name: 'Urdimbre',
        require: Validators.nullValidator,
      },
      {
        name: 'Shape',
        require: Validators.nullValidator,
      },
      {
        name: 'Commercial_length',
        require: Validators.nullValidator,
      },
      {
        name: 'Length_front',
        require: Validators.nullValidator,
      },
      {
        name: 'Finish',
        require: Validators.nullValidator,
      },
      {
        name: 'Adhesive',
        require: Validators.nullValidator,
      },
      {
        name: 'Application',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_stickers',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_accessories',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_finishes',
        require: Validators.nullValidator,
      },
      {
        name: 'Auxiliary_numbers',
        require: Validators.nullValidator,
      },
      {
        name: 'Reductive_numbers',
        require: Validators.nullValidator,
      },
    ];
    this.showFormFields(listNotRequired);
    this.Technical_origin = false;
    this.WMS_barcode = false;
    this.Quality = false;
    this.Urdimbre = false;
    this.Shape = false;
    this.Commercial_length = false;
    this.Length_front = false;
    this.Adhesive = false;
    this.Finish = false;
    this.Application = false;
    this.Number_stickers = false;
    this.Number_accessories = false;
    this.Number_finishes = false;
    this.Auxiliary_numbers = false;
    this.Reductive_numbers = false;
  }

  showFormFieldsHeatTransferRollo(): void {
    // Origen Técnico
    const listNotRequired = [
      {
        name: 'Technical_origin',
        require: Validators.nullValidator,
      },
      {
        name: 'WMS_barcode',
        require: Validators.nullValidator,
      },
      {
        name: 'Urdimbre',
        require: Validators.nullValidator,
      },
      {
        name: 'Shape',
        require: Validators.nullValidator,
      },
      {
        name: 'Commercial_length',
        require: Validators.nullValidator,
      },
      {
        name: 'Length_front',
        require: Validators.nullValidator,
      },
      {
        name: 'Finish',
        require: Validators.nullValidator,
      },
      {
        name: 'Adhesive',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_accessories',
        require: Validators.nullValidator,
      },
      {
        name: 'Reductive_numbers',
        require: Validators.nullValidator,
      },
    ];
    this.showFormFields(listNotRequired);
    this.Technical_origin = false;
    this.WMS_barcode = false;
    this.Urdimbre = false;
    this.Shape = false;
    this.Commercial_length = false;
    this.Length_front = false;
    this.Finish = false;
    this.Adhesive = false;
    this.Number_accessories = false;
    this.Reductive_numbers = false;
    
  }

  showFormFieldsPrint(): void {
    const listNotRequired = [
      {
        name: 'Technical_origin',
        require: Validators.nullValidator,
      },
      {
        name: 'WMS_barcode',
        require: Validators.nullValidator,
      },
      {
        name: 'Urdimbre',
        require: Validators.nullValidator,
      },
      {
        name: 'Shape',
        require: Validators.nullValidator,
      },
      {
        name: 'Finish',
        require: Validators.nullValidator,
      },
      {
        name: 'Adhesive',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_papers',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_accessories',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_finishes',
        require: Validators.nullValidator,
      },
      {
        name: 'Auxiliary_numbers',
        require: Validators.nullValidator,
      },
      {
        name: 'Reductive_numbers',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_stickers',
        require: Validators.nullValidator,
      },
    ];
    this.showFormFields(listNotRequired);

    this.Technical_origin = false;
    this.WMS_barcode = false;
    this.Urdimbre = false;
    this.Shape = false;
    this.Finish = false;
    this.Adhesive = false;
    this.Number_papers = false;
    this.Number_accessories = false;
    this.Number_finishes = false;
    this.Auxiliary_numbers = false;
    this.Reductive_numbers = false;
    this.Number_stickers = false;
  }

  showFormFieldsThermal(): void {
    const listNotRequired = [
      {
        name: 'WMS_barcode',
        require: Validators.nullValidator,
      },
      {
        name: 'Urdimbre',
        require: Validators.nullValidator,
      },
      {
        name: 'Adhesive',
        require: Validators.nullValidator,
      },
      {
        name: 'Size',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_stickers',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_papers',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_accessories',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_finishes',
        require: Validators.nullValidator,
      },
      {
        name: 'Auxiliary_numbers',
        require: Validators.nullValidator,
      },
      {
        name: 'Reductive_numbers',
        require: Validators.nullValidator,
      },
    ];
    this.showFormFields(listNotRequired);
    this.WMS_barcode = false;
    this.Urdimbre = false;
    this.Adhesive = false;
    this.Size = false;
    this.Number_stickers = false;
    this.Number_papers = false;
    this.Number_accessories = false;
    this.Number_finishes = false;
    this.Auxiliary_numbers = false;
    this.Reductive_numbers = false;
  }

  showFormFieldsReatasPretinas(): void {
    const listNotRequired = [
      {
        name: 'WMS_barcode',
        require: Validators.nullValidator,
      },
      {
        name: 'Urdimbre',
        require: Validators.nullValidator,
      },
      {
        name: 'Adhesive',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_stickers',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_papers',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_accessories',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_finishes',
        require: Validators.nullValidator,
      },
      {
        name: 'Auxiliary_numbers',
        require: Validators.nullValidator,
      },
      {
        name: 'Reductive_numbers',
        require: Validators.nullValidator,
      },
    ];
    this.showFormFields(listNotRequired);
    this.WMS_barcode = false;
    this.Urdimbre = false;
    this.Adhesive = false;
    this.Number_stickers = false;
    this.Number_papers = false;
    this.Number_accessories = false;
    this.Number_finishes = false;
    this.Auxiliary_numbers = false;
    this.Reductive_numbers = false;
  }

  showFormFieldsMascarillasTejidas(): void {
    const listNotRequired = [
      {
        name: 'WMS_barcode',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_stickers',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_papers',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_finishes',
        require: Validators.nullValidator,
      },
      {
        name: 'Auxiliary_numbers',
        require: Validators.nullValidator,
      },
      {
        name: 'Reductive_numbers',
        require: Validators.nullValidator,
      },
    ];
    this.showFormFields(listNotRequired);
    this.WMS_barcode = false;
    this.Number_stickers = false;
    this.Number_papers = false;
    this.Number_finishes = false;
    this.Auxiliary_numbers = false;
    this.Reductive_numbers = false;
  }

  showFormFieldsSublimationPrinting(): void {
    const listNotRequired = [
      {
        name: 'WMS_barcode',
        require: Validators.nullValidator,
      },
      {
        name: 'Urdimbre',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_stickers',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_accessories',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_finishes',
        require: Validators.nullValidator,
      },
      {
        name: 'Auxiliary_numbers',
        require: Validators.nullValidator,
      },
      {
        name: 'Reductive_numbers',
        require: Validators.nullValidator,
      },
    ];
    this.showFormFields(listNotRequired);
    this.WMS_barcode = false;
    this.Urdimbre = false;
    this.Number_stickers = false;
    this.Number_accessories = false;
    this.Number_finishes = false;
    this.Auxiliary_numbers = false;
    this.Reductive_numbers = false;
  }

  showFormFieldsSyntheticScreen(): void {
    const listNotRequired = [
      {
        name: 'Technical_origin',
        require: Validators.nullValidator,
      },
      {
        name: 'WMS_barcode',
        require: Validators.nullValidator,
      },
      {
        name: 'Urdimbre',
        require: Validators.nullValidator,
      },
      {
        name: 'Shape',
        require: Validators.nullValidator,
      },
      {
        name: 'Commercial_length',
        require: Validators.nullValidator,
      },
      {
        name: 'Length_front',
        require: Validators.nullValidator,
      },
      {
        name: 'Finish',
        require: Validators.nullValidator,
      },
      {
        name: 'Adhesive',
        require: Validators.nullValidator,
      },
      {
        name: 'Application',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_stickers',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_papers',
        require: Validators.nullValidator,
      },

      {
        name: 'Number_accessories',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_finishes',
        require: Validators.nullValidator,
      },
      {
        name: 'Auxiliary_numbers',
        require: Validators.nullValidator,
      },
      {
        name: 'Reductive_numbers',
        require: Validators.nullValidator,
      },
    ];
    this.showFormFields(listNotRequired);
    this.Technical_origin = false;
    this.WMS_barcode = false;
    this.Urdimbre = false;
    this.Shape = false;
    this.Commercial_length = false;
    this.Length_front = false;
    this.Finish = false;
    this.Adhesive = false;
    this.Application = false;
    this.Number_stickers = false;
    this.Number_papers = false;
    this.Number_accessories = false;
    this.Number_finishes = false;
    this.Auxiliary_numbers = false;
    this.Reductive_numbers = false;
  }

  showFormFieldsKits(): void {
    const listNotRequired = [
      {
        name: 'Quality',
        require: Validators.nullValidator,
      },
      {
        name: 'Urdimbre',
        require: Validators.nullValidator,
      },
      {
        name: 'Shape',
        require: Validators.nullValidator,
      },
      {
        name: 'Length_front',
        require: Validators.nullValidator,
      },
      {
        name: 'Finish',
        require: Validators.nullValidator,
      },
      {
        name: 'Adhesive',
        require: Validators.nullValidator,
      },
      {
        name: 'Size',
        require: Validators.nullValidator,
      },
      {
        name: 'Application',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_colors',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_stickers',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_papers',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_accessories',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_finishes',
        require: Validators.nullValidator,
      },
      {
        name: 'Auxiliary_numbers',
        require: Validators.nullValidator,
      },
      {
        name: 'Reductive_numbers',
        require: Validators.nullValidator,
      },
    ];
    this.showFormFields(listNotRequired);
    this.Quality = false;
    this.Urdimbre = false;
    this.Shape = false;
    this.Length_front = false;
    this.Finish = false;
    this.Adhesive = false;
    this.Size = false;
    this.Application = false;
    this.Number_colors = false;
    this.Number_stickers = false;
    this.Number_papers = false;
    this.Number_accessories = false;
    this.Number_finishes = false;
    this.Auxiliary_numbers = false;
    this.Reductive_numbers = false;
  }

  showFormFieldsHeatTransferLaser(): void {
    // Origen Técnico
    const listNotRequired = [
      {
        name: 'Technical_origin',
        require: Validators.nullValidator,
      },
      {
        name: 'WMS_barcode',
        require: Validators.nullValidator,
      },
      {
        name: 'Urdimbre',
        require: Validators.nullValidator,
      },
      {
        name: 'Shape',
        require: Validators.nullValidator,
      },
      {
        name: 'Commercial_length',
        require: Validators.nullValidator,
      },
      {
        name: 'Length_front',
        require: Validators.nullValidator,
      },
      {
        name: 'Finish',
        require: Validators.nullValidator,
      },
      {
        name: 'Adhesive',
        require: Validators.nullValidator,
      },
      {
        name: 'Size',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_stickers',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_accessories',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_finishes',
        require: Validators.nullValidator,
      },
      {
        name: 'Auxiliary_numbers',
        require: Validators.nullValidator,
      },
      {
        name: 'Reductive_numbers',
        require: Validators.nullValidator,
      },
    ];
    this.showFormFields(listNotRequired);
    this.Technical_origin = false;
    this.WMS_barcode = false;
    this.Urdimbre = false;
    this.Shape = false;
    this.Commercial_length = false;
    this.Length_front = false;
    this.Finish = false;
    this.Size = false;
    this.Adhesive = false;
    this.Number_accessories = false;
    this.Reductive_numbers = false;
    this.Number_stickers = false;
    this.Number_finishes = false;
    this.Auxiliary_numbers = false;
  }

  showFormFieldsHeatTransferPiezas(): void {
    const listNotRequired = [
      {
        name: 'Technical_origin',
        require: Validators.nullValidator,
      },
      {
        name: 'WMS_barcode',
        require: Validators.nullValidator,
      },
      {
        name: 'Urdimbre',
        require: Validators.nullValidator,
      },
      {
        name: 'Shape',
        require: Validators.nullValidator,
      },
      {
        name: 'Commercial_length',
        require: Validators.nullValidator,
      },
      {
        name: 'Length_front',
        require: Validators.nullValidator,
      },
      {
        name: 'Finish',
        require: Validators.nullValidator,
      },
      {
        name: 'Adhesive',
        require: Validators.nullValidator,
      },

      {
        name: 'Number_stickers',
        require: Validators.nullValidator,
      },
      {
        name: 'Number_accessories',
        require: Validators.nullValidator,
      },
    ];
    this.showFormFields(listNotRequired);
    this.Technical_origin = false;
    this.WMS_barcode = false;
    this.Urdimbre = false;
    this.Shape = false;
    this.Commercial_length = false;
    this.Length_front = false;
    this.Finish = false;
    this.Adhesive = false;
    this.Number_accessories = false;
    this.Number_stickers = false;
  }
  setDataDropdown(): void {
    this.ListNumberColors = this.dataGetDropdown(0, 16);
    this.ListNumberStickers = this.dataGetDropdown(0, 16);
    this.ListNumberPapers = this.dataGetDropdown(0, 5);
    this.ListNumberAccessories = this.dataGetDropdown(0, 16);
    this.ListNumberFinishes = this.dataGetDropdown(0, 16);
    this.ListAuxiliaryNumbers = this.dataGetDropdown(0, 16);
    this.ListReductiveNumbers = this.dataGetDropdown(0, 16);
  }

  dataGetDropdown(initialAmount: number, finalAmount: number): any[] {
    let filesData = [];
    for (let i = initialAmount; i < finalAmount; i++) {
      if (i == 0) {
        filesData.push({
          code: i,
          name: '0',
        });
      } else {
        filesData.push({
          code: i,
          name: i,
        });
      }
    }
    return filesData;
  }

  onFocusOutEvent(event: any) {
    if (event.target.value.trim() != '') {
      let statusFilterparams = [1, 2, 3, 4, 5];
      let sampleParameters = {
        sampleList: null,
        sampleNumber: null,
        internalProductCode: event.target.value,
        customerProductCode: null,
        description: null,
        productLine: null,
        width: null,
        lenght: null,
        status: null,
        typeOfDate: null,
        semaphoreId: null,
        startDate: null,
        endDate: null,
        page: 1,
        limit: 10,
        orderBy: 'CreationDate',
        ascending: true,
        customerId: this.paramCustomerId ? this.paramCustomerId : null,
        statusFilter: statusFilterparams,
      };

      this.productService.getSamples(sampleParameters).subscribe(
        (response) => {
          if (response && response.status) {
            if (
              this.router.url.includes('detail') &&
              this.itemProductIdCode.trim() == event.target.value.trim()
            ) {
              this.registerFormSesionTwo.patchValue({
                Origin_code: event.target.value,
                Technical_origin: event.target.value,
                WMS_barcode: this.barcodeFormat(event.target.value),
              });
            } else {
              this.showErrorMessage(
                event.target.value,
                this.paramCustomerId ? this.paramCustomerId : null
              );
              this.registerFormSesionTwo.patchValue({
                Item_code: null,
                Origin_code: null,
                Technical_origin: null,
                WMS_barcode: null,
              });
            }
          } else {
            this.registerFormSesionTwo.patchValue({
              Origin_code: event.target.value,
              Technical_origin: event.target.value,
              WMS_barcode: this.barcodeFormat(event.target.value),
            });
            this.registerFormSesionTwo.get('WMS_barcode').disable();
            this.registerFormSesionTwo
              .get('WMS_barcode')
              .updateValueAndValidity();
          }
        },
        (error) => {
          this.showErrorMessage(
            event.target.value,
            this.paramCustomerId ? this.paramCustomerId : null
          );
        }
      );
    }
  }

  showErrorMessage(productId: any, customerId: any): void {
    let message: string = this.errorMessageText;
    message = message.replace('{0}', productId);
    message = message.replace('{1}', customerId);
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: message,
    });
  }

  barcodeFormat(data: String): String {
    let lineaCode = '';
    for (let i = data.length; i < 15; i++) {
      lineaCode += '-';
    }
    return lineaCode + data;
  }

  onFocusOutEventLarge(event: any) {
    if (event.target.value.trim() != '') {
      this.paramLongProduction.emit(parseInt(event.target.value));
    }
  }

  updateLargeProduction(newValueLarge: number) {
    this.registerFormSesionTwo.patchValue({
      Long_production: newValueLarge,
    });
  }

  dataComplete() {
    this.dataCompleteForm.emit(this.registerFormSesionTwo);
  }

  /*TODO: obtiene el rol y segun el enum ex: FOPS_CUSTOMER_B2C consulta cuales campos deben estar disable al momento de editar */
  public getrole() {
    let profile = this._storageService.getProfiles();
    this.sales.getJSON().subscribe((roles) => {
      //servicio de json roles
      this.rolepermission = roles[this.RolesEnum[profile.role]];
      let rolemodule = this.rolepermission[0][this.KEYPERMISSION_ROLE]; //array segun el formulario
      let active = rolemodule.filter((x) => x.status == true); //filtra cuales segun json deben deshabilitarse
      for (let index = 0; index < active.length; index++) {
        this.registerFormSesionTwo.get(active[index].components).disable(); //formatea los campos a disable
      }
    });
  }

  public readactiondetail() {
    this.router.url.includes('detail')
      ? (this.formsetdetails(), (this.details = true))
      : false;
  }

  public readactionedit() {
    return this.router.url.includes('edit') ? false : false;
  }

  public formsetdetails() {
    Object.keys(this.registerFormSesionTwo.controls).forEach((key, index) => {
      this.registerFormSesionTwo.get(key).disable();
    });
  }

  //se realiza para el momento de editar no se deje cambiar itemcode
  public inactiveeditother() {
    this.registerFormSesionTwo.get('Item_code').disable();
  }

  validateMaxLen($event: any, maxLength: number): boolean {
    return $event.target.value.length != maxLength;
  }
}

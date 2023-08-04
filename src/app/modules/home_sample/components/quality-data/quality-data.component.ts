import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/public_api';
import { SalesService } from 'src/app/core/services/sales/sales.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-quality-data',
  templateUrl: './quality-data.component.html',
  styleUrls: ['./quality-data.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class QualityDataComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  formMaterialsIconStatus = [];
  formStatusText = [];
  showMessage: boolean = false;
  showMessageTwo: boolean = false;

  jsonService = [];

  public myForm: FormGroup = this.formBuilder.group({});

  constructor(
    private formBuilder: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private salesService: SalesService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {}

  public paramLine(lineId: number, isCreateMode: boolean, productId: string) {
    let data = { lineId, productId };
    if (isCreateMode) {
      this.salesService.qualityGet(data).subscribe(
        (response) => {
          if (response) {
            if (response.status) {
              this.jsonService = response.data;
              for (let index = 0; index < this.jsonService.length; index++) {
                let controles = this.jsonService[index].controls;
                for (let i = 0; i < controles.length; i++) {
                  if (
                    controles[i].options !== undefined &&
                    controles[i].options !== null
                  ) {
                    if (
                      controles[i].options.tooltiptext !== undefined &&
                      controles[i].options.tooltiptext !== null &&
                      controles[i].options.tooltiptext !== ''
                    ) {
                      this.translate
                        .stream(controles[i].options.tooltiptext)
                        .subscribe((res: string) => {
                          controles[i].options.tooltiptext = res;
                        });
                    }
                  }
                }
              }

              this.createForm(this.jsonService);
            } else {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
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
    }else
    {
      this.salesService.qualityEditGet(data).subscribe(
        (response) => {
          if (response) {
            if (response.status) {
              this.jsonService = response.data;
              for (let index = 0; index < this.jsonService.length; index++) {
                let controles = this.jsonService[index].controls;
                for (let i = 0; i < controles.length; i++) {
                  if (
                    controles[i].options !== undefined &&
                    controles[i].options !== null
                  ) {
                    if (
                      controles[i].options.tooltiptext !== undefined &&
                      controles[i].options.tooltiptext !== null &&
                      controles[i].options.tooltiptext !== ''
                    ) {
                      this.translate
                        .stream(controles[i].options.tooltiptext)
                        .subscribe((res: string) => {
                          controles[i].options.tooltiptext = res;
                        });
                    }
                  }
                }
              }

              this.createForm(this.jsonService);
            } else {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
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
  }

  get qualityDataForm() {
    return this.myForm.get('SESIONS').value;
  }

  ngOnInit(): void {
    this.createForm(this.jsonService);
  }

  get sesionsFormCall() {
    return this.myForm.get('SESIONS') as FormArray;
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(): void {
    this.validateFormStatus();
  }

  createForm(controls: any[]) {
    this.myForm = this.formBuilder.group({
      SESIONS: this.formBuilder.array([], this.itemSesion({})),
    });
    controls.forEach((elementSesion, indexSesion) => {
      this.sesionsFormCall.push(this.itemSesion(elementSesion));
      const oneGroup = new FormGroup({});
      elementSesion.controls?.forEach((elementInput, indexInput) => {
        const validatorsToAdd = [];
        switch (elementInput.validators.required) {
          case true:
            validatorsToAdd.push(Validators.required);
            break;
          case false:
            validatorsToAdd.push(Validators.nullValidator);
            break;
          default:
            validatorsToAdd.push(Validators.nullValidator);
            break;
        }
        oneGroup.addControl(
          elementInput.name,
          this.formBuilder.control(elementInput.value, validatorsToAdd)
        );
        this.validateControlOther(
          elementInput.label,
          elementInput.name,
          oneGroup
        );
      });
      (
        this.sesionsFormCall.at(indexSesion).get('controlsFix') as FormArray
      ).push(oneGroup);
    });
    this.validateFormStatus();
  }

  private itemSesion(data: any): FormGroup {
    return this.formBuilder.group({
      PropertyCategoryId: [data.propertyCategoryId, [Validators.nullValidator]],
      PropertieCategoryCode: [
        data.propertieCategoryCode,
        [Validators.nullValidator],
      ],
      PropertieCategoryName: [
        data.propertieCategoryName,
        [Validators.nullValidator],
      ],
      DisplayThisCategory: [
        data.displayThisCategory,
        [Validators.nullValidator],
      ],
      PropertyCategorySequence: [
        data.propertyCategorySequence,
        [Validators.nullValidator],
      ],
      controlsFix: this.formBuilder.array([]),
    });
  }

  getFormArrayJson(index: number): any {
    return this.jsonService[index].controls;
  }

  selectedInputswitch(data: any) {
    this.jsonService[data.index].controls?.forEach((elementSesion) => {
      if (data.state) {
        if (
          elementSesion.label.trim() != 'Otro' &&
          elementSesion.label.trim() != 'Other'
        ) {
          (
            this.sesionsFormCall.at(data.index).get('controlsFix') as FormArray
          ).controls[0]
            .get(elementSesion.name)
            .enable();
        }
      } else {
        (
          this.sesionsFormCall.at(data.index).get('controlsFix') as FormArray
        ).controls[0]
          .get(elementSesion.name)
          .disable();
        (
          this.sesionsFormCall.at(data.index).get('controlsFix') as FormArray
        ).controls[0]
          .get(elementSesion.name)
          .setValue('');
      }
    });
  }

  validateFormStatus(): void {
    this.setValidateFormStatus();
    this.myForm.valueChanges.subscribe((value) => {
      this.setValidateFormStatus();
    });
  }

  setValidateFormStatus(): void {
    this.sesionsFormCall.controls.forEach((element, index) => {
      this.formMaterialsIconStatus[index] = 2;
      this.formStatusText[index] =
        'technical-sheets.session_form_without_completed';
      let statusForm = element?.status ? element.status : 'INVALID';
      let propertyCategoryId = element?.value
        ? element.value?.PropertyCategoryId
          ? element.value.PropertyCategoryId
          : 0
        : 0;
      switch (propertyCategoryId) {
        case 2:
          element.value.controlsFix?.forEach((element) => {
            let limitPorcetage = this.Sumar(element);
            if (limitPorcetage > 100) {
              this.showMessage = true;
            } else if (limitPorcetage <= 0 && statusForm != 'INVALID') {
              this.showMessageTwo = true;
            } else {
              this.formMaterialsIconStatus[index] =
                statusForm != 'INVALID' ? 1 : 2;
              this.formStatusText[index] =
                statusForm != 'INVALID'
                  ? 'technical-sheets.session_form_completed'
                  : 'technical-sheets.session_form_without_completed';
            }
          });

          break;
        case 1:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
        case 13:
        case 15:
        case 16:
          if (element.value.DisplayThisCategory != true) {
            this.formMaterialsIconStatus[index] =
              element.status != 'INVALID' &&
              element.value.DisplayThisCategory != true
                ? 0
                : 2;
            this.formStatusText[index] =
              element.status != 'INVALID'
                ? ''
                : 'technical-sheets.session_form_without_completed';
          }
          break;

        default:
          this.formMaterialsIconStatus[index] =
            element.status != 'INVALID' ? 1 : 2;
          this.formStatusText[index] =
            element.status != 'INVALID'
              ? 'technical-sheets.session_form_completed'
              : 'technical-sheets.session_form_without_completed';
          break;
      }
    });
  }

  validateControlOther(label, name, oneGroup) {
    if (label.trim() == 'Otro' || label == 'Other') {
      oneGroup.controls[name].disable();
    }
  }

  Sumar(valor: any) {
    let componentValue = [];
    let indexComponent = 0;
    for (var prop in valor) {
      indexComponent++;
      componentValue.push({
        index: indexComponent,
        name: prop.trim(),
        value: valor[prop],
      });
    }

    let result: number =
      Number(componentValue[1].value) +
      Number(componentValue[2].value) +
      Number(componentValue[3].value) +
      Number(componentValue[4].value) +
      Number(componentValue[5].value);
    return result;
  }

  onKeyPressNumber(_event) {
    return /[0-9]/.test(String.fromCharCode(_event.which));
  }

  onKeyPressNumberDecimal(_event) {
    return /[0-9.]/.test(String.fromCharCode(_event.which));
  }

  validateOnchange(event, sesiones) {
    var itemMultiselect;
    if (event.itemValue) {
      event.value.forEach((element) => {
        if (element.trim() == 'Otro') itemMultiselect = element.toString();
      });
    } else {
      var itemselect = event.value.toString();
    }
    this.validateControls(itemMultiselect, itemselect, sesiones);
  }

  validateControls(itemMultiselect, itemselect, sesiones) {
    try {
      if (itemselect?.replace(/ /g, '') == 'Otro') {
        sesiones.controls.controlsFix.controls.forEach((element) => {
          var item = element as FormGroup;
          item.controls.MetodoPruebasLavadoOtro?.enable();
        });
      } else if (
        itemMultiselect?.replace(/ /g, '') == 'Otro' ||
        itemselect?.replace(/ /g, '') == 'otro'
      ) {
        sesiones.controls.controlsFix.controls.forEach((element) => {
          var item = element as FormGroup;
          item.controls.Otro?.enable();
          item.controls.TipoLavadoOtro?.enable();
        });
      } else {
        if (itemMultiselect == undefined) {
          sesiones.controls.controlsFix.controls.forEach((element) => {
            var item = element as FormGroup;
            item.controls.Otro?.disable();
          });
        }
        sesiones.controls.controlsFix.controls.forEach((element) => {
          var item = element as FormGroup;
          if (
            item.controls?.TipoLavadoRequerido !== undefined &&
            item.controls?.TipoLavadoRequerido !== null
          ) {
            if (item.controls?.TipoLavadoRequerido.value.trim() != 'otro') {
              item.controls.TipoLavadoOtro?.disable();
            }
          }

          if (
            item.controls?.MetodoPruebasLavado != null &&
            item.controls?.MetodoPruebasLavado != undefined
          ) {
            if (item.controls?.MetodoPruebasLavado.value.trim() != 'Otro') {
              item.controls.MetodoPruebasLavadoOtro?.disable();
            }
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  onSubmit() {}
}

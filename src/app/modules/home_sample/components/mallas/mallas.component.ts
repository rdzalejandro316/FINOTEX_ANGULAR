import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { Table } from 'src/app/shared/framework-ui/primeng/tablafinotex/public_api';
import { environment } from 'src/environments/environment';
import { TechnicalDataLines } from 'src/app/shared/constant/tecnicalDataLine';
import { MasterProductService } from 'src/app/core/services/masterProduct/master-product.service';
import { ProfilesService } from 'src/app/core/services/profile/profiles.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';


declare var $: any;
@Component({
  selector: 'app-mallas',
  templateUrl: './mallas.component.html',
  styleUrls: ['./mallas.component.css'],
  providers: [MessageService],
})
export class MallasComponent implements OnInit, AfterViewInit {
  @ViewChild('tablaFinotex') someInput: Table;
  mallasDataForm: FormGroup;
  expandedRows: {} = {};
  linesIdShow = TechnicalDataLines.GetTechnicalDataLineg;
  showOutletHeat: boolean = false;
  showMiddleHeat: boolean = false;
  showNumberMesh: boolean = false;
  listMesh: [];
  currentPage: number = 1;
  pageLenght = environment.pageLenght;
  totalRecords: number = 0;
  showModalMallas: boolean = false;
  indexMesh: number = 0;
  meshId:number =0;
  styleMobiles: any = { width: '80vw' };

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private translate: TranslateService,
    private masterProductService: MasterProductService,
    private profilesService: ProfilesService,
    private responsive: BreakpointObserver
  ) { }

  get mallasFormCall() {
    return this.mallasDataForm.get('header') as FormArray;
  }

  ngAfterViewInit(): void {
    const thisRef = this;
    this.mallasFormCall.value.forEach(function (car) {
      thisRef.someInput.expandedRowKeys[car.id] = false;
    });
    this.expandedRows = Object.assign({}, this.expandedRows);
  }

  ngOnInit(): void {
    this._InitForms();
    this.resizeWindow();
    window.addEventListener('resize', (e) => {
      this.resizeWindow();
    });
  }

  resizeWindow(): void {
    this.responsive.observe(Breakpoints.XSmall).subscribe((result) => {
      if (result.matches) {
        this.showModalMallas = false;
        this.styleMobiles = { width: '105vw' };
      } else {
        this.showModalMallas = false;
        this.styleMobiles = { width: '80vw' };
      }
    });
  }

  resizeModal() {
    return this.styleMobiles;
  }

  receiveParamsMaterials(params: any) {
    try {
      let data = params;
      if (this.mallasFormCall.length == 0 && data != null && data != undefined) {
        for (let index = 0; index < data.length;  index++) {
          const idProcessSettings = index + 1;
          const element = data[index];
          this.mallasFormCall.push(
            this.itemMaterials({
              id: idProcessSettings,
              typeMaterial: element.positionMaterial,
              description: element.description,
              materialPositionId: element.materialPositionId
            })
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  private _InitForms() {
    this.mallasDataForm = this.formBuilder.group({
      header: this.formBuilder.array([], this.itemHeader()),
    });
  }

  private itemHeader(): FormGroup {
    return this.formBuilder.group({
      id: ['', Validators.nullValidator],
      typeMaterial: ['', [Validators.nullValidator]],
      description: ['', [Validators.nullValidator]],
      meshId: ['', [Validators.nullValidator]],
      meshCode:['',Validators.nullValidator],
      frameNumber: ['', [Validators.nullValidator]],
      pressure: ['', [Validators.nullValidator]],
      light: ['', [Validators.nullValidator]],
      squeegeeSpeed: ['', [Validators.nullValidator]],
      squeegeePressure: ['', [Validators.nullValidator]],
      squeegeAngle: ['', [Validators.nullValidator]],
      floodBarPressure: ['', [Validators.nullValidator]],
      fpmSpeed: ['', [Validators.nullValidator]],
      outletHeat: ['', [Validators.nullValidator]],
      middleHeat: ['', [Validators.nullValidator]],
      inletHeat: ['', [Validators.nullValidator]],
      commnets: ['', [Validators.nullValidator]],
      materialPositionId: ['', [Validators.nullValidator]],
    });
  }

  private itemMaterials(data: any): FormGroup {
    return this.formBuilder.group({
      id: [data.id, Validators.nullValidator],
      typeMaterial: [data.typeMaterial, Validators.nullValidator],
      description: [data.description, Validators.nullValidator],
      meshId: ['', [Validators.nullValidator]],
      meshCode:['',Validators.nullValidator],
      frameNumber: ['', [Validators.nullValidator]],
      pressure: ['', [Validators.nullValidator]],
      light: ['', [Validators.nullValidator]],
      squeegeeSpeed: ['', [Validators.nullValidator]],
      squeegeePressure: ['', [Validators.nullValidator]],
      squeegeAngle: ['', [Validators.nullValidator]],
      floodBarPressure: ['', [Validators.nullValidator]],
      fpmSpeed: ['', [Validators.nullValidator]],
      outletHeat: ['', [Validators.nullValidator]],
      middleHeat: ['', [Validators.nullValidator]],
      inletHeat: ['', [Validators.nullValidator]],
      commnets: ['', [Validators.nullValidator]],
      materialPositionId: [data.materialPositionId, [Validators.nullValidator]],
    });
  }

  onItemClick(rowData: any, dt: any) {
    if (dt.expandedRowKeys[rowData.id]) {
      dt.expandedRowKeys[rowData.id] = false;
    } else {
      dt.expandedRowKeys[rowData.id] = true;
    }
  }

  public showHideForm(paramLineId: number) {
    if (
      paramLineId == this.linesIdShow.heattranferRollo ||
      paramLineId == this.linesIdShow.heatTranferPiezas
    ) {
      this.showMiddleHeat = true;
      this.showOutletHeat = true;
    } else {
      this.showMiddleHeat = false;
      this.showOutletHeat = false;
    }
  }

  selectMeshId(rowindex: number) {
    this.getAllMesh();
    this.indexMesh = rowindex;
    this.showNumberMesh = true;
    this.showPanelDialogMallas(false);
  }

  getAllMesh(): void {
    const formDataFilterSearch = {
      page: this.currentPage,
      limit: this.pageLenght,
      orderBy: 'meshId',
      ordAscendingerBy: true,
    };
    this.masterProductService.getMesh(formDataFilterSearch).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.listMesh = response.data;
            this.totalRecords = response.quantity;
            this.reloadTableConfiguration();
          } else {
            this.listMesh = [];
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
        this.listMesh = [];
      },
      () => {
        $('#allTable').DataTable().destroy();
        this.reloadTableConfiguration();
      }
    );
  }

  reloadTableConfiguration(): void {
    $(function () {
      var configuration = {
        destroy: true,
        retrieve: true,
        searching: false,
        ordering: false,
        scrollX: false,
        scrollY: false,
        paging: false,
        info: false,
        responsive: {
          details: {
            renderer: function (api, rowIdx, columns) {
              var data = $.map(columns, function (col, i) {
                return col.hidden
                  ? '<div class="col-12 col-md-3 mb-2" >' +
                  '<label>' +
                  col.title +
                  '</label> ' +
                  '<input type="text" value="' +
                  col.data +
                  '" readonly class="form-control p-inputtext"/>' +
                  '</div>'
                  : '';
              }).join('');

              return data ? $('<div class="row"/>').append(data) : false;
            },
          },
        },
      };

      $('#allTable').DataTable(configuration).draw();
    });
  }

  selectMeshNumber(meshCode: any, meshId:any) {
    this.mallasFormCall.at(this.indexMesh).get('meshCode').setValue(meshCode);
    this.mallasFormCall.at(this.indexMesh).get('meshId').setValue(meshId);
    this.showNumberMesh = false;
    this.showPanelDialogMallas(true);
  }

  paginate(event: { page: number; rows: number }) {
    this.currentPage = event.page + 1;
    this.pageLenght = event.rows;
    this.getAllMesh();
  }

  showModalProductionLarge() {
    this.showNumberMesh = false;
  }

  showPanelDialogMallas(open: boolean): void {
    this.showModalMallas = open;
  }

  onKeyPressNumberDecimal(event) {
    return /[0-9.]/.test(String.fromCharCode(event.which));
  }
}

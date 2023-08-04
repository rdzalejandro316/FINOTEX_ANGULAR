import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { Table } from 'src/app/shared/framework-ui/primeng/tablafinotex/public_api';
import { TranslateService } from '@ngx-translate/core';
import { MasterProductService } from 'src/app/core/services/masterProduct/master-product.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

declare var $: any;
@Component({
  selector: 'app-formula-color',
  templateUrl: './color-formula.component.html',
  styleUrls: ['./color-formula.component.css'],
  providers: [MessageService],
})
export class FormulaColorsComponent implements OnInit, AfterViewInit {
  @ViewChild('tablaFinotex') someInput: Table;
  lblNumberArticle: string = '';
  showColorFormula: boolean = false;
  listFormulaColor: [];
  dataNoFound: boolean = true;
  percentageOverOrdered: boolean = false;
  styleMobiles: any = { width: '80vw' };
  resizableLabel:boolean = false;

  constructor(
    private messageService: MessageService,
    private translate: TranslateService,
    private masterProductService: MasterProductService,
    private responsive: BreakpointObserver
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.resizeWindow();
    window.addEventListener('resize', (e) => {
      this.resizeWindow();
    });
  }

  resizeWindow(): void {
    this.responsive.observe(Breakpoints.XSmall).subscribe((result) => {
      if (result.matches) {
        this.showColorFormula = false;
        this.resizableLabel = true;
        this.styleMobiles = { width: '105vw' };
      } else {
        this.showColorFormula = false;
        this.resizableLabel = false;
        this.styleMobiles = { width: '80vw' };
      }
    });
  }

  resizeModal() {
    return this.styleMobiles;
  }

  getAllFormulaColor(materialIdParam: any): void {
    const formDataFilterSearch = { materialId: materialIdParam };

    this.masterProductService.getFormulaColor(formDataFilterSearch).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.listFormulaColor = response.data;
            this.dataNoFound = false;
            this.reloadTableConfiguration();
          } else {
            this.listFormulaColor = [];
            this.dataNoFound = true;
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
        this.listFormulaColor = [];
        this.dataNoFound = true;
      },
      () => {
        $('#tableFormulaColors').DataTable().destroy();
        this.reloadTableConfiguration();
      }
    );
  }

  getAllFormulaColorSpecial(materialIdParam: any): void {
    const formDataFilterSearch = {
      materialId: materialIdParam,
    };

    this.masterProductService
      .getFormulaColorSpecial(formDataFilterSearch)
      .subscribe(
        (response) => {
          if (response) {
            if (response.status) {
              this.listFormulaColor = response.data;
              this.dataNoFound = false;
              this.reloadTableConfiguration();
            } else {
              this.listFormulaColor = [];
              this.dataNoFound = true;
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
          this.listFormulaColor = [];
          this.dataNoFound = true;
        },
        () => {
          $('#tableFormulaColors').DataTable().destroy();
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

      $('#tableFormulaColors').DataTable(configuration).draw();
    });
  }

  showPanelDialogFormulaColors(open: boolean): void {
    this.showColorFormula = open;
  }

  GetDataFormulaColors(
    isSpecial: boolean,
    materialIdParam: any,
    title: string
  ): void {
    this.lblNumberArticle = title;
    if (title.trim() == '') {
      this.dataNoFound = true;
    }

    if (!isSpecial) {
      this.percentageOverOrdered = true;
      this.getAllFormulaColor(materialIdParam);
    } else {
      this.percentageOverOrdered = false;
      this.getAllFormulaColorSpecial(materialIdParam);
    }
  }
}

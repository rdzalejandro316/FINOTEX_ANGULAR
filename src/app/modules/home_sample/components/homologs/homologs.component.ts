import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SalesService } from 'src/app/core/services/sales/sales.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/public_api';
import { TranslateService } from '@ngx-translate/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

declare var $: any;
@Component({
  selector: 'app-homologs',
  templateUrl: './homologs.component.html',
  styleUrls: ['./homologs.component.css'],
  providers: [MessageService],
})
export class HomologsComponent implements OnInit {
  totalRecords: number = 0;
  showHomologs: boolean = false;
  listHomologs = [];
  page: number = 1;
  pageLenght = environment.pageLenght;
  paramMaterialId: any;
  dataNoFound: boolean;
  styleMobiles: any = { width: '60vw' };

  constructor(
    private salesService: SalesService,
    private messageService: MessageService,
    private translate: TranslateService,
    private responsive: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.resizeWindow();
    window.addEventListener('resize', (e) => {
      this.resizeWindow();
    });
  }

  resizeWindow(): void {
    this.responsive.observe(Breakpoints.XSmall).subscribe((result) => {
      if (result.matches) {
        this.showHomologs = false;
        this.styleMobiles = { width: '105vw' };
      } else {
        this.showHomologs = false;
        this.styleMobiles = { width: '60vw' };
      }
    });
  }

  resizeModal() {
    return this.styleMobiles;
  }

  showPanelDialogHomologs(open: boolean, _materialId): void {
    this.showHomologs = open;
    if (_materialId !== null) {
      this.paramMaterialId = _materialId;
      this.getHomologs();
    }
    this.dataNoFound = true;
  }

  getHomologs(): void {
    const formDataFilterSearch = {
      page: this.page,
      limit: this.pageLenght,
      orderBy: 'ProductId',
      ordAscendingerBy: true,
      materialId: this.paramMaterialId,
    };
    this.salesService.homologsGet(formDataFilterSearch).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.dataNoFound = false;
            this.listHomologs = response.data;
            this.totalRecords = response.quantity;
          } else {
            this.dataNoFound = true;
            this.listHomologs = [];
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: response.message,
            });
          }
        } else {
          this.dataNoFound = true;
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

  paginate(event: { page: number; rows: number }) {
    this.page = event.page + 1;
    this.pageLenght = event.rows;
    this.getHomologs();
  }

  showModalHomologs() {
    this.showHomologs = false;
  }
}

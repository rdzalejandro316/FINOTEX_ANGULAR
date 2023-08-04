import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Canvas, Cell, Columns, Img, PdfMakeWrapper, QR, Rect, Stack, Table, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Base64Imagen } from 'src/app/shared/constant/userType';
import { ProductService } from '../product/product.service';
import { StorageService } from '../storage/storage.service';

PdfMakeWrapper.setFonts(pdfFonts);

@Injectable({
  providedIn: 'root',
})
export class TelasService
 {

  constructor(
    private datePipe: DatePipe,
    private translate: TranslateService,
    private storageService: StorageService,
    private productService: ProductService) { }

  onCreatePDFSales(data: any, sampleId: number) {
    this.datasheetByLine(data, sampleId);
  }

    datasheetByLine(data: any, sampleId: number) {
    const dataSampleById = {
      "companyId": this.storageService.getProfiles().businessId,
      "sampleId": sampleId,
    };
    this.productService.getSampleById(dataSampleById).subscribe(
      (response) => {
        var statusSample: string
        if (response.data.sampleStatusId == 6) {
          statusSample = this.translatorFinotex("pdf-report.statusSample");
        } else {
          statusSample = this.translatorFinotex("pdf-report.statusSample2");
        }
        console.log(data);
        
        this.buildPDFStamp(statusSample, data)

      },
      (error) => {

      },
      () => { }
    );

  }

  async buildPDFStamp(statusSample: string, data: any): Promise<void> {

    const pdf = new PdfMakeWrapper();
    var value = [];

    data.bodyDto.forEach((element) => {
      var dataRow = [];
      dataRow.push({
        text: element.position,
        alignment: 'center',
        fontSize: 7,
      });

      dataRow.push({
        text: element.colorClass.trim(),
        alignment: 'center',
        fontSize: 7,
      });

      dataRow.push({
        text: element.description,
        alignment: 'center',
        fontSize: 7,
      });

      dataRow.push({
        text: element.code.trim(),
        alignment: 'center',
        fontSize: 7,
      });

      dataRow.push({
        text: element.aniloxXl,
        alignment: 'center',
        fontSize: 7,
      });

      dataRow.push({
        text: element.aniloxL6,
        alignment: 'center',
        fontSize: 7,
      });

      dataRow.push({
        text: element.fr,
        alignment: 'center',
        fontSize: 7,
      });
      value.push(dataRow);
    });

    var options = " ";

    data.footerDto.options.forEach((element) => {
      options += element + ", "
    });

    var docDefinition = {
      footer: function (currentPage, pageCount) {
        return {
          text: currentPage.toString() + ' of ' + pageCount,
          alignment: 'right',
          fontSize: 8,
          margin: ([5, 5, 15, 5])
        }
      },
    };

    pdf.styles({
      tableHeader: {
        fontSize: 7,
        bold: true,
      },
      tableContent: {
        fontSize: 6,
        bold: false,
      }
    });



    pdf.header(
      new Stack([
        //Tabla header imagen
        new Table([
          [
            new Cell(
              await new Img("https://finotex.blob.core.windows.net/imagereports/FinotexLogo.png?sp=r&st=2022-07-14T18:11:59Z&se=2023-07-15T02:11:59Z&spr=https&sv=2021-06-08&sr=b&sig=SH7rV1n%2BuG%2BANtY%2BGxugjpDe%2BZkPUebe8cBwWOq1Fgs%3D")
                .height(40)
                .width(90)
                .build(),
            ).rowSpan(2).border([false, false, false, false]).end,

            new Cell(new Txt(statusSample).font("Roboto").bold().alignment('center').fontSize(15).end).margin(8).border([false, false, false, false]).end,

            new Cell(
              new QR('898555').fit(50).end,
            ).border([false, false, false, false]).alignment('right').end,
          ],
          [
            null,
            {
              stack: [
                new Table([
                  [
                    new Cell(new Txt(data.headerDto?.lineName == null ? " " : data.headerDto.lineName).alignment('left').fontSize(9).bold().end).font("Roboto").colSpan(2).border([true, true, true, false]).end,
                    new Cell(new Txt(this.translatorFinotex("pdf-report.impresion") + " " + data.headerDto.dateRequest.substr(0, 10)).alignment('center').fontSize(9).end).font("Roboto").colSpan(2).border([true, true, true, false]).end,
                  ]
                ]).widths([250, 130]).absolutePosition(120, 52).end
              ],
              colSpan: 2
            },
            null
          ]
        ]).widths(['auto', '*', '*'])
        .layout('noBorders').end,

        //tabla zona

        new Table([
          [
            new Cell(new Txt(this.translatorFinotex("stamped-report.zone").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
            new Cell(new Txt(this.translatorFinotex("stamped-report.coordinator").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
            new Cell(new Txt(this.translatorFinotex("stamped-report.customer").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
            new Cell(new Txt("CONS.SIST").font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
            new Cell(new Txt(this.translatorFinotex("stamped-report.order").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
            new Cell(new Txt(this.translatorFinotex("stamped-report.application").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
            new Cell(new Txt(this.translatorFinotex("stamped-report.Print").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end
          ],
          [
            new Cell(new Txt(data.headerDto.zone == null ? " " : data.headerDto.zone.trim()).alignment('center').fontSize(7).end).font("Roboto").colSpan(1).end,
            new Cell(new Txt(this.storageService.getUser().username).alignment('center').fontSize(7).end).font("Roboto").colSpan(1).end,
            new Cell(new Txt(data.headerDto.customer.trim()).alignment('left').fontSize(7).end).font("Roboto").colSpan(1).end,
            new Cell(new Txt(data.headerDto.consecutiveSystem).alignment('center').fontSize(7).end).font("Roboto").colSpan(1).end,
            new Cell(new Txt(data.headerDto.order).alignment('center').fontSize(7).end).font("Roboto").colSpan(1).end,
            new Cell(new Txt(this.datePipe.transform(data.headerDto?.dateRequest, 'dd/MM/yyyy')).alignment('center').fontSize(7).end).font("Roboto").colSpan(1).end,
            new Cell(new Txt(this.datePipe.transform(new Date(), 'dd/MM/yyyy')).alignment('center').fontSize(7).end).font("Roboto").colSpan(1).end,
          ]
        ]).widths(['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto']).margin([0, -1, 0, 0]).end,
      ]).width("*").margin([20, 20, 20, 20]).end
    );

    

    pdf.add([
      //Tabla 2 Codigo,Descripción,Producto,Calidad,Aprobación
      new Table([
        [
          //Titulos
          //Codigo
          new Cell(new Txt(this.translatorFinotex("stamped-report.code").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
          //Descripción
          new Cell(new Txt(this.translatorFinotex("stamped-report.description").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
          //Producto
          new Cell(new Txt(this.translatorFinotex("stamped-report.products").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
          //Calidad
          new Cell(new Txt(this.translatorFinotex("stamped-report.quality").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
          //Aprobación
          new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tabletwo_Approval").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,     
        ],
        [
          //Contenido con DATA
          //Codigo
          new Cell(new Txt(data.headerDto.code.trim()).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
          //Descripción
          new Cell(new Txt(data.headerDto.description.trim()).font("Roboto").bold().alignment('left').fontSize(7).end).colSpan(1).end,
          //Producto
          new Cell(new Txt(data.headerDto.product.trim()).font("Roboto").bold().alignment('left').fontSize(7).end).colSpan(1).end,
          //Calidad
          new Cell(new Txt(data.headerDto.quality).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
          //Aprobación
          new Cell(new Txt(data.headerDto.sampleApprovalTypeName).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
        ]
        ]).widths(['auto', '*', '*', 'auto', 'auto'])
      .margin([0, -22, 0, 0])
      .style(['tableHeader', 'tableContent'])
      .end,

      //Tabla 3 Urdimbre,Forma,Aplicación,Talla,Cantidad a Producir
      new Table([
        [ 
          //Titulos
          //Urdimbre
          new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablethree_Warp_color").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
          //Forma
          new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablethree_Shape").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
          //Aplicación
          new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablethree_Application").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,     
          //Talla
          new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablethree_Size").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
          //Cantidad a Producir
          new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablethree_Quantity_to_produce").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
        ],
        [
          //Contenido con DATA
           //Urdimbre
           new Cell(new Txt("Pendiente").font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
           //Forma
           new Cell(new Txt(data.headerDto.shape.trim()).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
           //Aplicación
           new Cell(new Txt(data.headerDto.application.trim()).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,     
           //Talla
           new Cell(new Txt(data.headerDto.application.trim()).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
           //Cantidad a Producir
           new Cell(new Txt(data.headerDto.quantityproduce).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
        ]
        ]).widths(['*', '*', '*', '*', '*'])
      .margin([0, 1, 0, 0])
      .style(['tableHeader', 'tableContent'])
      .end,

      //Tabla 4 Ancho,Frente ,Largo ,# Accesorios,Maquina,Picks,Pasada total,Pasada Camara,Pasada Maquina
      new Table([
        [
           //Titulos
          //Ancho
          new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablefour_Width").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
          //Frente
          new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablefour_Front").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
          //Largo
          new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablefour_Length").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
          //# Accesorios
          //new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablefour_Accessories").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
          //Maquina
          new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablefour_Machine").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,        
          //Picks
          new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablefour_Picks").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,           
          //Pasada total
          new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablefour_Total_Picks").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
          //Pasada Camara
          new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablefour_Camera_Picks").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,            
          //Pasada Maquina
          new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablefour_Machine_Picks").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,          
        ],
        [
          //Contenido con DATA
          //Ancho
          new Cell(new Txt(data.headerDto.width).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
          //Frente
          new Cell(new Txt(data.headerDto.front).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
          //Largo
          new Cell(new Txt(data.headerDto.long).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
          //# Accesorios
          //new Cell(new Txt("Pendiente").font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
          //Maquina
          new Cell(new Txt(data.headerDto.resourceModelCode).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
          //Picks
          new Cell(new Txt(data.headerDto.picks).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
          //Pasada total
          new Cell(new Txt(data.headerDto.totalPicks).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
          //Pasada Camara
          new Cell(new Txt(data.headerDto.camaraPicks).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
          //Pasada Maquina
          new Cell(new Txt(data.headerDto.machine).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
          
        ]
        ]).widths(['auto', 'auto', 'auto', 'auto', 'auto', '*', '*', '*'])
      .margin([0, 1, 0, 0])
      .style(['tableHeader', 'tableContent'])
      .end,
     //tabla 5 Tensión Urdimbre  
      new Columns([
        new Stack([
          new Table([
            [
               //Titulos padres
               //Tensión Urdimbre  
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablefive_Warp_Tension").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(2).end,
              null,
              //Telares
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablefive_telares").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(3).end,
              null,null
            ],
            [ 
              //Titulos Hijos
              //Rango 
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablefive_Range").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
              //Valor
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablefive_Worth").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
              //Temp. Slittings
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablefive_Slittings").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
              //Secuencia
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablefive_Sequence").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
              //Forma tejido 
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablefive_Fabric_Shape").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
            ],
            [
              //Contenido con DATA
              //Rango 
              new Cell(new Txt(data.headerDto.range== null ? " " :data.headerDto.range ).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
              //Valor
              new Cell(new Txt(data.footerDto.worth== null ? " ":data.footerDto.worth ).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
              //Temp. Slittings
              new Cell(new Txt(data.footerDto.temperatureSlittings == null ? " " : data.footerDto.temperatureSlittings).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
              //Secuencia
              new Cell(new Txt(data.footerDto.sequence == null ? " " : data.footerDto.sequence).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
              //Forma tejido 
              new Cell(new Txt(data.footerDto.fabricShape == null ?  " ": data.footerDto.fabricShape).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
            ]
          ]).widths(['*', '*','*', '*','*']).end,
        ]).width("*").end,
      ]).columnGap(3).margin([0, 1, 0, 0])
      .style(['tableHeader', 'tableContent']).end,

      //Tabla de Contenido
      new Columns([
        new Stack([
          new Table([
            /*[
              new Cell(new Txt(this.translatorFinotex("stamped-report.Print").toLocaleUpperCase()).bold().alignment('center').fontSize(9).end).fillColor("#C8C9CB").colSpan(8).end,
              {}, {}, {}, {}, {}, {}, {}
            ],*/
            [
              //Posición material
              new Cell(new Txt(this.translatorFinotex("stamped-report.Position").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
              //Titulo/categoria
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablecontent_Category_Code").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
              //Color/clase  Material
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablecontent_Color_Code").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
              //Descripción 
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablecontent_Description").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
              //Codigo material
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablecontent_Material_Code").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
              //Picks /hilo M. Ensamble 
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablecontent_MEnsamble").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
              //Unidad
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablecontent_Unit_Code").toUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
            ],
            ...value,
          ]).widths(['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto']).end,

         

        ]).width("auto").end,

        //Tabla Muestra
        new Stack([
          new Table([
            [
              new Cell(new Txt(this.translatorFinotex("stamped-report.PhysicalSample").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
            ],
            [
              await new Img(data.footerDto?.graphicUrl == null || data.footerDto?.graphicUrl == "" ? Base64Imagen.NotImagen : data.footerDto?.graphicUrl)
              .fit([205,303],).alignment('center')
              .build(),
            ],
            [ 
              //Bien  propiedad  del cliente 
              new Table([
                [
                  //Bien  propiedad  del cliente 
                  new Cell(new Txt(this.translatorFinotex("stamped-report.Customer_property").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(2).end,
                  {}
                ],
                [
                  //Entrada 
                  new Cell(new Txt(this.translatorFinotex("stamped-report.Entry").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).end,
                  //Salida
                  new Cell(new Txt(this.translatorFinotex("stamped-report.Exit").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).end,
                ],
                [
                  //Entrada
                  new Cell(
                    new Columns([
                      new Canvas(data.footerDto?.isCustomerProperty == null ? 
                        [this.pixelRound(0, 1, "#ffffff", "#000000")] : data.footerDto?.isCustomerProperty == 'S' ? 
                        [this.pixelRound(0, 1, "#000000", "#000000")] : [this.pixelRound(0, 1, "#ffffff", "#000000")]).end,
                      new Txt('Si').bold().alignment('left').fontSize(9).end,
                      new Canvas(data.footerDto?.isCustomerProperty == null ? 
                        [this.pixelRound(0, 1, "#ffffff", "#000000")] : data.footerDto?.isCustomerProperty == 'N' ? 
                        [this.pixelRound(0, 1, "#000000", "#000000")] : [this.pixelRound(0, 1, "#ffffff", "#000000")]).end,
                      new Txt('No').bold().alignment('left').fontSize(9).end,
                    ]).columnGap(1).width("auto").end
                  ).end,
                  //Salida
                  new Cell(
                    new Columns([
                      //SI/NO
                      new Canvas([this.pixelRound(0, 1, "#ffffff", "#000000")]).end,
                      new Txt('Si').bold().alignment('left').fontSize(9).end,
                      new Canvas([this.pixelRound(0, 1, "#ffffff", "#000000")]).end,
                      new Txt('No').bold().alignment('left').fontSize(9).end,
                    ]).columnGap(1).width("auto").end
                  ).end,
                ],
                [
                   //Fecha 
                   new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.other_date").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).end,
                   //Fecha numero
                   null,
                   //new Cell(new Txt("17/08/2022").font("Roboto").bold().alignment('center').fontSize(7).end).end,
                ]
              ]).layout('lightHorizontalLines').margin([-2, -2, -2, -2]).widths([140,55]).end,
            ]
          ]).widths([205]).alignment('center').height(303).end
        ]).width("auto").end,

      ]).columnGap(3).margin([0, 5, 0, 0]).end,

       //Tabla 6 - Observaciones
       new Columns([
        new Stack([
          new Table([
            [
              //Titulo Padre
              //Observaciones
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablesix_Notes").toLocaleUpperCase()).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(5).end,
              null,null,null,null
            ],
            [
              //Contenido 
              //Observaciones Contenido
              new Cell(new Txt(data.footerDto.observations).bold().alignment('center').fontSize(7).end).colSpan(5).end,
              null,null,null,null
            ],
            [
              //Titulos Hijos
              //Opciones
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablesix_options").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
              //Acabado
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablesix_Finish_code").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
              //Embobinado
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablesix_Winding").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
              //Refuerzo
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablesix_Reinforcement").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
              //Corte 
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tablesix_Cut").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
            ],
            [
              //Opciones
              new Cell(new Txt(data.footerDto.options.join(' , ')).font("Roboto").bold().alignment('left').fontSize(7).end).colSpan(1).end,
              //Acabado
              new Cell(new Txt(data.headerDto.finish).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
              //Embobinado
              new Cell(await new Img(data.footerDto.windingUrlImage == null ? Base64Imagen.NotImagen : data.footerDto.windingUrlImage).fit([160, 50]).alignment('center').build()).colSpan(1).end,
              //Refuerzo
              new Table([
                  [
                    new Cell(new Txt(data.headerDto.reinforcement).font("Roboto").bold().alignment('left').fontSize(7).end).colSpan(2).end,
                    null
                  ],
                  [
                    new Cell(new Txt(this.translatorFinotex("stamped-report.Packaging").toUpperCase()).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(2).end,
                    null
                  ],
                  [
                    new Cell(new Txt(this.translatorFinotex("stamped-report.Quantity").toUpperCase()).bold().alignment('left').fontSize(7).end).end,
                    new Cell(new Txt(data.footerDto.packagingQuantity).bold().alignment('center').fontSize(7).end).end,
                  ],
                  [
                    new Cell(new Txt(this.translatorFinotex("stamped-report.Packaging").toUpperCase()).bold().alignment('left').fontSize(7).end).end,
                    new Cell(new Txt(data.footerDto.packagingReference).bold().alignment('center').fontSize(7).end).end,
                  ]
              ]).widths(['auto','auto']).end,
              //Corte 
              new Cell(await new Img(data.footerDto.cutUrlImage == null ? Base64Imagen.NotImagen : data.footerDto.cutUrlImage).fit([90, 50]).alignment('center').build()).colSpan(1).end,
            ]

          ]).widths(['*', '*','*', '*','*']).end
        ]).width("*").end,

      ]).columnGap(2).margin([0, 1, 0, 0]).end,
      //Tabla 7 Archivos de diseño
      new Columns([
      new Stack([
        new Table([
          [
            //Titulo Padres 
            //Archivo Grafico
            new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tableseven_Graphic_art_archive").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).fillColor("#C8C9CB").end,
            //Diseno  
            new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tableseven_Designed").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(2).fillColor("#C8C9CB").end,
            null,
            //Tejeduria 
            new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tableseven_weaver").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(2).fillColor("#C8C9CB").end,
            null
          ],
          [
            //Archivo Grafico
            new Cell(new Txt(data.footerDto.graphicArtArchive).alignment('center').fontSize(7).end).rowSpan(2).end,
            //Diseno  
            new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.other_date").toLocaleUpperCase()).font("Roboto").bold().alignment('left').fontSize(7).end).colSpan(1).fillColor("#C8C9CB").end,
            new Cell(new Txt("Diseñador".toLocaleUpperCase()).font("Roboto").bold().alignment('left').fontSize(7).end).colSpan(1).fillColor("#C8C9CB").end,
            //Tejeduria 
            new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.other_date").toLocaleUpperCase()).font("Roboto").bold().alignment('left').fontSize(7).end).colSpan(1).fillColor("#C8C9CB").end,
            new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tableseven_weavers").toLocaleUpperCase().toLocaleUpperCase()).font("Roboto").bold().alignment('left').fontSize(7).end).colSpan(1).fillColor("#C8C9CB").end,
          ],
          [
            //Archivo Grafico
            null,
            //new Cell(await new Img(data.footerDto.cutUrlImage == null ? Base64Imagen.NotImagen : data.footerDto.cutUrlImage).fit([160,30]).alignment('center').build()).border([true, false, true, true]).colSpan(1).end,
            //Diseno  
            new Cell(new Txt(data.footerDto.dateDesigned.toLocaleUpperCase()).font("Roboto").bold().alignment('left').fontSize(7).end).colSpan(1).end,
            new Cell(new Txt(data.footerDto.designed.trim().toLocaleUpperCase()).font("Roboto").bold().alignment('left').fontSize(7).end).colSpan(1).end,
            //Tejeduria 
            null,
            null,
            //new Cell(new Txt("17/08/2022".toLocaleUpperCase()).font("Roboto").bold().alignment('left').fontSize(7).end).colSpan(1).end,
            //new Cell(new Txt("Tejedor".toLocaleUpperCase()).font("Roboto").bold().alignment('left').fontSize(7).end).colSpan(1).end,
          ]
        ]).widths(['auto','auto','auto','*','*']).end,
      ]).width("*").end,
        ]).columnGap(3).margin([0, 5, 0, 0])
      .style(['tableHeader', 'tableContent']).end,

      //Registro Calidad 
      new Columns([
        new Stack([
          new Table([
            [
              new Cell(new Txt('Registro de Calidad').bold().alignment('right').fontSize(10).end).end,
              new Cell(new Txt('FOC03-06').bold().alignment('left').fontSize(10).end).end,
            ]
          ]).layout('noBorders').margin([0, 1, 0, 0]).widths(['*', '*']).end
        ]).width('*').end
      ]).columnGap(3).margin([0, 15, 0, 0]).end,
    ]);

    pdf.pageSize('A4');
    pdf.pageMargins([20, 120, 20, 20]);
    pdf.footer(docDefinition.footer);
    pdf.create().open();
  }

  private pixelRound(x: number, y: number, colorBackground: string, colorLine: string) {
    return new Rect([x, y], 10).color(colorBackground).lineColor(colorLine).round(50).end;
  }

  private pixel(x: number, y: number, colorBackground: string, colorLine: string) {
    return new Rect([x, y], [20, 10]).color(colorBackground).lineColor(colorLine).end;
  }

  private translatorFinotex(data: string): string {
    return this.translate.instant(data);
  }
}

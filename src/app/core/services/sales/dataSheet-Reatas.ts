import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Canvas, Cell, Columns, Img, PdfMakeWrapper, QR, Rect, Stack, Table, Txt } from "pdfmake-wrapper";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Base64Imagen } from "src/app/shared/constant/userType";
import { ProductService } from "../product/product.service";
import { StorageService } from "../storage/storage.service";



PdfMakeWrapper.setFonts(pdfFonts);
@Injectable({
    providedIn: 'root'

})

export class DataSheetGetByReatas {


    constructor(
        private datePipe: DatePipe,
        private translate: TranslateService,
        private storageService: StorageService,
        private productService: ProductService) { }

    onCreatePDFReatas(data: any, sampleId: number) {
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
                this.buildPdfReatas(statusSample, data)

            },
            (error) => {

            },
            () => { }
        );

    }



    async buildPdfReatas(statusSample: string, data: any): Promise<void> {

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
                text: element.materialCategoryName.trim(),
                alignment: 'center',
                fontSize: 7,
            });

            dataRow.push({
                text: element.colorClass,
                alignment: 'center',
                fontSize: 7,
            });

            dataRow.push({
                text: element.description.trim(),
                alignment: 'center',
                fontSize: 7,
            });

            dataRow.push({
                text: element.code,
                alignment: 'center',
                fontSize: 7,
            });

            dataRow.push({
                text: element.pickHilo,
                alignment: 'center',
                fontSize: 7,
            });

            dataRow.push({
                text: element.unitCode,
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
                        new Cell(new Txt(this.translatorFinotex("pdf-report.zone")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                        new Cell(new Txt(this.translatorFinotex("pdf-report.producedBy")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                        new Cell(new Txt(this.translatorFinotex("pdf-report.customer")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                        new Cell(new Txt(this.translatorFinotex("pdf-report.consecutiveSystem"),).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                        new Cell(new Txt(this.translatorFinotex("pdf-report.order")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                        new Cell(new Txt(this.translatorFinotex("pdf-report.application")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                        new Cell(new Txt(this.translatorFinotex("pdf-report.impresion")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end
                    ],
                    [
                        new Cell(new Txt(data.headerDto.zone == null ? " " : data.headerDto.zone.trim()).alignment('center').fontSize(7).end).font("Roboto").colSpan(1).end,
                        new Cell(new Txt(this.storageService.getUser().username).alignment('center').fontSize(7).end).font("Roboto").colSpan(1).end,
                        new Cell(new Txt(data.headerDto.customer.trim()).alignment('center').fontSize(7).end).font("Roboto").colSpan(1).end,
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
                    new Cell(new Txt(this.translatorFinotex("pdf-report.code")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                    //Descripción
                    new Cell(new Txt(this.translatorFinotex("pdf-report.description")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                    //Producto
                    new Cell(new Txt(this.translatorFinotex("pdf-report.product")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                    //Calidad
                    new Cell(new Txt(this.translatorFinotex("pdf-report.quality")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                    //Aprobación
                    new Cell(new Txt(this.translatorFinotex("pdf-report.approvalType")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                ],
                [
                    //Contenido con DATA
                    //Codigo
                    new Cell(new Txt(data.headerDto.code.trim()).font("Roboto").alignment('center').fontSize(7).end).colSpan(1).end,
                    //Descripción
                    new Cell(new Txt(data.headerDto.description.trim()).font("Roboto").alignment('center').fontSize(7).end).colSpan(1).end,
                    //Producto
                    new Cell(new Txt(data.headerDto.product.trim()).font("Roboto").alignment('center').fontSize(7).end).colSpan(1).end,
                    //Calidad
                    new Cell(new Txt(data.headerDto.quality).font("Roboto").alignment('center').fontSize(7).end).colSpan(1).end,
                    //Aprobación
                    new Cell(new Txt(data.headerDto.sampleApprovalTypeName).font("Roboto").alignment('center').fontSize(7).end).colSpan(1).end,
                ]
            ]).widths(['auto', '*', '*', 'auto', 'auto'])
                .margin([0, -22, 0, 0])
                .style(['tableHeader', 'tableContent'])
                .end,

            //Tabla 3 Urdimbre,Forma,Aplicación,Talla,Cantidad a Producir
            new Table([
                [
                    //Titulos
                    //Ancho
                    new Cell(new Txt(this.translatorFinotex("pdf-report.width")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                    //Frente
                    new Cell(new Txt(this.translatorFinotex("pdf-report.front")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                    //Largo
                    new Cell(new Txt(this.translatorFinotex("pdf-report.long")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                    //Forma
                    new Cell(new Txt(this.translatorFinotex("pdf-report.shape")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                    //Aplicación
                    new Cell(new Txt(this.translatorFinotex("pdf-report.applicationR")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                    //Cantidad a Producir
                    new Cell(new Txt(this.translatorFinotex("pdf-report.quantityProduce")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                ],
                [
                    //Contenido con DATA
                    //Ancho
                    new Cell(new Txt(data.headerDto.width).font("Roboto").alignment('center').fontSize(7).end).colSpan(1).end,
                    //Frente
                    new Cell(new Txt(data.headerDto.front).font("Roboto").alignment('center').fontSize(7).end).colSpan(1).end,
                    //Largo
                    new Cell(new Txt(data.headerDto.long).font("Roboto").alignment('center').fontSize(7).end).colSpan(1).end,

                    //Forma
                    new Cell(new Txt(data.headerDto.shape.trim()).font("Roboto").alignment('center').fontSize(7).end).colSpan(1).end,
                    //Aplicación
                    new Cell(new Txt(data.headerDto.application.trim()).font("Roboto").alignment('center').fontSize(7).end).colSpan(1).end,
                    //Cantidad a Producir
                    new Cell(new Txt(data.headerDto.quantityproduce).font("Roboto").alignment('center').fontSize(7).end).colSpan(1).end,
                ]
            ]).widths(['*', '*', '*', '*', '*', '*'])
                .margin([0, 1, 0, 0])
                .style(['tableHeader', 'tableContent'])
                .end,

            //   //Tabla 4 Ancho,Frente ,Largo ,# Accesorios,Maquina,Picks,Pasada total,Pasada Camara,Pasada Maquina
            new Table([
                [
                    //Titulos

                    //Maquina
                    new Cell(new Txt(this.translatorFinotex("pdf-report.machine")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                    //Picks
                    new Cell(new Txt(this.translatorFinotex("pdf-report.picks")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                    //Pasada total
                    new Cell(new Txt(this.translatorFinotex("pdf-report.totalPicks")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                    //Pasada Camara
                    new Cell(new Txt(this.translatorFinotex("pdf-report.cameraPicks")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                    //Pasada Maquina
                    new Cell(new Txt(this.translatorFinotex("pdf-report.machinePicks")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                ],
                [
                    //Contenido con DATA

                    //Maquina
                    new Cell(new Txt(data.headerDto.machine).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
                    //Picks
                    new Cell(new Txt(data.headerDto.picks).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
                    //Pasada total
                    new Cell(new Txt(data.headerDto.totalPicks).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
                    //Pasada Camara
                    new Cell(new Txt(data.headerDto.camaraPicks).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
                    //Pasada Maquina
                    new Cell(new Txt(data.headerDto.machine).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,

                ]
            ]).widths(['*', '*', '*', '*', '*'])
                .margin([0, 1, 0, 0])
                .style(['tableHeader', 'tableContent'])
                .end,
            //tabla 5 Tensión Urdimbre  
            new Columns([
                new Stack([
                    new Table([
                        [
                            //Titulos padres

                            //Telares
                            new Cell(new Txt(this.translatorFinotex("pdf-report.telares")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(2).end,
                            null,
                            //Calandria
                            new Cell(new Txt(this.translatorFinotex("pdf-report.calender")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").rowSpan(2).margin(6).end,

                            //Distribución Dientes 
                            new Cell(new Txt(this.translatorFinotex("pdf-report.distribucionDientes")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(2).end,
                            null,
                        ],
                        [
                            //Titulos Hijos

                            //Tension Urdimbre
                            new Cell(new Txt(this.translatorFinotex("pdf-report.warpTension")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                            //Numero de peine
                            new Cell(new Txt(this.translatorFinotex("pdf-report.comb")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
                            null,
                            //dientes
                            new Cell(new Txt(this.translatorFinotex("pdf-report.dientes")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
                            //hilos
                            new Cell(new Txt(this.translatorFinotex("pdf-report.threads")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,

                        ],
                        [
                            //Tension Urdimbre
                            new Cell(new Txt(data.headerDto.worth).font("Roboto").alignment('center').fontSize(7).end).colSpan(1).end,
                            //Numero de peine
                            new Cell(new Txt(data.headerDto.numberPeine).font("Roboto").alignment('center').fontSize(7).end).colSpan(1).end,
                            //calender
                            new Cell(new Txt("Pendiente").font("Roboto").alignment('center').fontSize(7).end).colSpan(1).end,
                            //Dientees
                            new Cell(new Txt(data.headerDto.dientes).font("Roboto").alignment('center').fontSize(7).end).colSpan(1).end,
                            //Hilos
                            new Cell(new Txt(data.headerDto.threads).font("Roboto").alignment('center').fontSize(7).end).colSpan(1).end,


                        ]
                    ]).widths(['*', '*', '*', '*', '*']).end,
                ]).width("*").end,
            ]).columnGap(3).margin([0, 1, 0, 0])
                .style(['tableHeader', 'tableContent']).end,

            //Tabla de Contenido
            new Columns([
                new Stack([
                    new Table([

                        [
                            //Posición material
                            new Cell(new Txt(this.translatorFinotex("pdf-report.positionItem")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
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
                            new Cell(new Txt(this.translatorFinotex("pdf-report.originalSample")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
                        ],
                        [
                            await new Img(data.footerDto?.graphicUrl == null ? Base64Imagen.NotImagen : data.footerDto?.graphicUrl)
                                 .fit([205,303],).alignment('center')
                                .build(),
                        ],

                    ]).widths([205]).alignment('center').height(303).end
                ]).width("*").end,

            ]).columnGap(3).margin([0, 5, 0, 0]).end,

 //Tabla 6 - Observaciones
 new Columns([
    new Stack([
        new Table([
            [
                //Titulo Padre
                //Observaciones
                new Cell(new Txt(this.translatorFinotex("pdf-report.notes")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
                //opciones 
                new Cell(new Txt(this.translatorFinotex("pdf-report.options")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
                //corte  
                new Cell(new Txt(this.translatorFinotex("pdf-report.cut")).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
            ],
            [
                //Contenido 
                //Observaciones Contenido
                new Cell(new Txt(data.footerDto.observations).bold().alignment('center').fontSize(7).end).end,
                //options
                new Cell(new Txt(data.footerDto.options+" ").font("Roboto").alignment('center').fontSize(7).end).end,
                //Cut
                new Cell(await new Img(data.footerDto.cutUrlImage == null ? Base64Imagen.NotImagen : data.footerDto.cutUrlImage)
                    .height(70)
                    .width(60).alignment('center')
                    .build()).end,
            ],
        ]).widths(['*', 'auto', 'auto']).end
    ]).width("*").end,

]).columnGap(2).margin([0, 15, 0, 0]).end,

            //Tabla 7 Archivos de diseño
            new Columns([
                new Stack([
                    new Table([
                        [
                            //Titulo Padres 
                            //Archivo Grafico
                            new Cell(new Txt(this.translatorFinotex("pdf-report.graphicArchive")).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).fillColor("#C8C9CB").end,
                            //Diseno  
                            new Cell(new Txt(this.translatorFinotex("pdf-report.designed")).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(2).fillColor("#C8C9CB").end,
                            null,
                            //Tejeduria 
                            new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tableseven_weaver").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(2).fillColor("#C8C9CB").end,
                            null
                        ],
                        [
                            //Archivo Grafico
                            new Cell(new Txt(data.footerDto.graphicArtArchive).alignment('center').fontSize(7).end).rowSpan(2).end,
                            //Diseno  
                            new Cell(new Txt(this.translatorFinotex("pdf-report.date")).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).fillColor("#C8C9CB").end,
                            new Cell(new Txt(this.translatorFinotex("pdf-report.designer")).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).fillColor("#C8C9CB").end,
                            //Tejeduria 
                            new Cell(new Txt(this.translatorFinotex("pdf-report.date")).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).fillColor("#C8C9CB").end,
                            new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.tableseven_weavers").toLocaleUpperCase().toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).fillColor("#C8C9CB").end,
                        ],
                        [
                            //Archivo Grafico
                            null,

                            //Diseno  
                            new Cell(new Txt(data.footerDto.dateDesigned.substr(0, 10)).font("Roboto").alignment('center').fontSize(7).end).colSpan(1).end,
                            new Cell(new Txt(data.footerDto.designed.trim()).font("Roboto").alignment('center').fontSize(7).end).colSpan(1).end,
                            //Tejeduria 
                            null,
                            null,

                        ]
                    ]).widths(['auto', 'auto', 'auto', '*', '*']).end,
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


    private translatorFinotex(data: string): string {
        return this.translate.instant(data);
    }
}
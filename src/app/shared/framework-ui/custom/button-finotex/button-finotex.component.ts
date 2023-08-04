import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from '../../primeng/paginator/public_api';

@Component({
  selector: 'app-button-finotex',
  template: `<button [disabled]="disabled" type="{{ type }}" class="{{ _class }}{{ _size }}">
                {{ label | translate }}
              </button>`,
  styleUrls: ['./button-finotex.component.css'],
  host: {
    'class': 'p-element'
  }  
})
export class ButtonFinotexComponent implements OnInit {

  @Input() label: string = "formsGeneral.texto_botton";
  @Input() typeButton: string = "primary";
  @Input() typeSize: boolean = true;
  @Input() type: string = "button";
  @Input() disabled: boolean = false;

  _class: string = ""
  _size: string = null;

  
  constructor() { }

  ngOnInit(): void {
    this._size = this.typeSize ? " size" : ""
    this.typeButtonFormat();
  }

  typeButtonFormat() {
    switch(this.typeButton) {
      case "primary":
        this._class = "btn-primary-finotex";
        break;
      case "secondary":
        this._class = "btn-secondary-fonotex";
        break;
      default:
        this._class = "btn-primary-finotex";
        break;
    }
  }

}

@Component({
  selector: 'app-button-icon-finotex',
  template: `<button [disabled]="disabled" type="{{ type }}" class="{{ _class }}{{ _size }}">
                <span [ngClass]="{'p-button-icon': true,
                  'p-button-icon-left': iconPos === 'left' && label,
                  'p-button-icon-right': iconPos === 'right' && label}"
                  [class]="icon" [attr.aria-hidden]="true"></span>
                <span class="p-button-label" [attr.aria-hidden]="icon && !label" >
                  {{ label | translate }}
                </span>
              </button>`,
  styleUrls: ['./button-finotex.component.css'],
  host: {
    'class': 'p-element'
  }  
})
export class ButtonIconFinotexComponent implements OnInit {

  @Input() label: string = "formsGeneral.texto_botton";
  @Input() typeButton: string = "primary";
  @Input() typeSize: boolean = true;
  @Input() type: string = "button";
  @Input() disabled!: boolean;
  @Input() iconPos: 'left' | 'right' | 'top' = 'left';
  @Input() icon: string = "";

  _class: string = "";
  _size: string = null;
  
  constructor() { }

  ngOnInit(): void {
    this._size = this.typeSize ? " size" : ""
    this.typeButtonFormat();
  }

  typeButtonFormat() {
    switch(this.typeButton) {
      case "primary":
        this._class = "btn-primary-finotex";
        break;
      case "secondary":
        this._class = "btn-secondary-fonotex";
        break;
      default:
        this._class = "btn-primary-finotex";
        break;
    }
  }

}

@Component({
  selector: 'app-button-icon-cart-finotex',
  template: `<button [disabled]="disabled" type="{{ type }}" class="{{ _class }}">
                <span [ngClass]="{'p-button-icon': true,
                  'p-button-icon-left': iconPos === 'left' && label,
                  'p-button-icon-right': iconPos === 'right' && label,
                  'p-button-icon-top': iconPos === 'top' && label,
                  'p-button-icon-bottom': iconPos === 'bottom' && label}"
                  [class]="icon" [attr.aria-hidden]="true"></span>
                <span class="p-button-label" [attr.aria-hidden]="icon && !label" >
                  {{ label | translate }}
                </span>
                <span *ngIf="displayItem" class="badge-cart">
                  {{itemsCart}}
                </span>
              </button>`,
  styleUrls: ['./button-finotex.component.css'],
  host: {
    'class': 'p-element'
  }  
})
export class ButtonIconCartFinotexComponent implements OnInit {

  @Input() label: string = "formsGeneral.texto_botton";
  @Input() typeButton: string = "primary";
  @Input() typeSize: boolean = true;
  @Input() type: string = "button";
  @Input() disabled!: boolean;
  @Input() iconPos: 'left' | 'right' | 'top' | 'bottom' = 'left';
  @Input() icon: string = "";
  @Input() itemsCart: number = 0;
  @Input() displayItem: boolean = false;

  _class: string = "";
  _size: string = null;
  
  constructor() { }

  ngOnInit(): void {
    this.typeButtonFormat();
  }

  typeButtonFormat() {
    switch(this.typeButton) {
      case "primary":
        this._class = "app-button-icon-cart-primary";
        break;
      case "secondary":
        this._class = "app-button-icon-cart-secondary";
        break;
      default:
        this._class = "app-button-icon-cart-primary";
        break;
    }
  }
}

@NgModule({
  declarations: [ButtonFinotexComponent,ButtonIconFinotexComponent, ButtonIconCartFinotexComponent],
  exports: [ButtonFinotexComponent,ButtonIconFinotexComponent, ButtonIconCartFinotexComponent],
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ]
})
export class ButtonFinotexModule { }

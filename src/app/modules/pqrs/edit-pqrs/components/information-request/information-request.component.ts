import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { PqrsService } from 'src/app/core/services/pqrs/pqrs.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { RequestDto } from 'src/app/modules/pqrs/edit-pqrs/components/models/PqrsModel';

@Component({
  selector: 'app-information-request',
  templateUrl: './information-request.component.html',
  styleUrls: ['./information-request.component.css'],
  providers: [MessageService]
})
export class InformationRequestComponent implements OnInit {
  constructor(
    private readonly formBuilder: FormBuilder, 
    private router: Router, 
    private storageService: StorageService, 
    public translate: TranslateService,
    private pqrsService: PqrsService,
    private messageService: MessageService) 
  {translate.use(this.language);}
  
  language = this.storageService.getLanguage() == null ? 'EN' : this.storageService.getLanguage();
  generalDataRequestFrom: FormGroup;
  request= new RequestDto();
  showNotFoundFile : boolean = false;

  get generalDataRequestFromCall() {
    return this.generalDataRequestFrom.get('header') as FormArray;
  }

  ngOnInit(): void {
    this._InitForms();
    this.loadDataTableRequest();
  }

  _InitForms() {
    this.generalDataRequestFrom = this.formBuilder.group({
      header: this.formBuilder.array([]),
    });;
  }

  private itemsRequest(data: any): FormGroup {
    return this.generalDataRequestFrom =  this.formBuilder.group({
      documentId: [data.documentId, Validators.nullValidator],
      countryName:  [data.countryName, Validators.nullValidator],
      address:  [data.address, Validators.nullValidator],
      phone1:  [data.phone1, Validators.nullValidator],
      phone2: [data.phone2, Validators.nullValidator],
      email:  [data.email, Validators.nullValidator],
      businessName:  [data.businessName, Validators.nullValidator],
      notes:  [data.notes, Validators.nullValidator],
      fileName:  [data.fileName, Validators.nullValidator],
      fileUrl: [data.fileUrl, Validators.nullValidator],
    });
  }

  loadDataTableRequest() {
    this.itemsRequest({      
          documentId: this.request.documentId,
          countryName:  this.request.countryName,
          address:  this.request.address,
          phone1:  this.request.phone1,
          phone2:  this.request.phone2,
          email:  this.request.email,
          notes:  this.request.notes,
          businessName:  this.request.businessName,
          fileName:  this.request.fileName,
          fileUrl: this.request.fileUrl
    });
  }

  dowload() 
  {
    var fileUrl = this.generalDataRequestFrom.controls.fileUrl.value;

    if(fileUrl == null || fileUrl == '')
    {
      this.showNotFoundFile = true;
    }
    else
    {
      const byteCharacters = atob(this.generalDataRequestFrom.controls.fileUrl.value);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'application/x-zip-compressed'});
      let url = URL.createObjectURL(blob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = this.generalDataRequestFrom.controls.fileName.value;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }
}

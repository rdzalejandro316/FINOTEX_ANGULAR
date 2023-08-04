import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/core/services/storage/storage.service';


@Component({
  selector: 'app-pqrs',
  templateUrl: './pqrs.component.html',
  styleUrls: ['./pqrs.component.css']
})
export class PqrsComponent implements OnInit {

  language = this.storageService.getLanguage() == null ? 'EN' : this.storageService.getLanguage();
  
  constructor(
    private translate: TranslateService,
    private storageService: StorageService,
    ) 
  {
    translate.use(this.language);
   }

  ngOnInit(): void {
  }

}

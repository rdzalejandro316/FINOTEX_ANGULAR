import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav-bar-main',
  templateUrl: './nav-bar-main.component.html',
  styleUrls: ['./nav-bar-main.component.css']
})
export class NavBarMainComponent implements OnInit {
  isEnglish = true;

  constructor(
    public translate: TranslateService,
    private storageService: StorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    let currentLang: string;
    currentLang = this.storageService.getLanguage()
      ? this.storageService.getLanguage()
      : 'en';
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang(currentLang);
    this.translate.use(currentLang);
    this.isEnglish = !(this.storageService.getLanguage() == 'es');
  }

  switchLang(lang: string, reload = true) {
    this.isEnglish = true;
    this.storageService.addLanguage(lang);
    this.isEnglish = !(this.translate.currentLang == 'es');
    if (reload) {
      this.translate.use(lang);
      window.location.reload();
    }
  }

  openLogin() {
    this.router.navigate(['login']);
  }

  previous()
  {
    this.router.navigate(['..']);
  }

}

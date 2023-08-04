import { Component, OnInit, ElementRef, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';
import { ProfilesService } from 'src/app/core/services/profile/profiles.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, DoCheck {

  constructor(
    private elementRef: ElementRef,
    private storageService: StorageService,
    private profilesService: ProfilesService,
    private router: Router,
    private authService: MsalService) { }

  ngDoCheck(): void {
    if (this.storageService.getUser() == null) {
      this.storageService.logoutUser();
    }
  }

  ngOnInit(): void {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../../../assets/js/template.js";
    this.elementRef.nativeElement.appendChild(script);
  }

}

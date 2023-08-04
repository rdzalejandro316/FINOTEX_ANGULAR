import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { ProfilesService } from 'src/app/core/services/profile/profiles.service';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { CookieService } from 'src/app/core/services/cookie/cookie.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/public_api';


@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css'],
  providers: [MessageService],
})
export class ProfilesComponent implements OnInit {
  registerForm!: FormGroup;

  countries = [];
  showCountries = false;
  business = [];
  showBusiness = false;
  profile = [];
  showProfile = false;
  securityUsersId = 0;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private messageService: MessageService,
    private storageService: StorageService,
    private cookieService: CookieService,    
    private authService: MsalService,
    private loadingService: LoadingService,
    private profilesService: ProfilesService
  ) {}

  ngOnInit(): void {
    this.getForm();
    this.getProfileService();
  }

  private getForm() {
    return (this.registerForm = this.formBuilder.group({
      countries: ['', Validators.required],
      business_facility: ['', Validators.required],
      profile_role: ['', Validators.required],
    }));
  }

  onSubmitRole(): void {
    this.prfileUserGrup(
      this.registerForm.get('business_facility').value,
      this.securityUsersId
    );
  }

  getProfileService() {
    this.sharedService.getProfile().subscribe(
      (response) => {
        if (response.status) {
          this.countries = response.data.countryProfile;
          this.securityUsersId = response.data.securityUsersId;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message,
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
      () => {this.validateProfiles()}
    );
  }

  validateProfiles(): void {
    this.loadingService.show();
    if (this.countries.length == 1) {
      this.registerForm.controls.countries.setValue(
        this.countries[0].countryId
      );
      this.onChangeCountries(this.countries[0].countryId);
    } else {
      this.showCountries = this.countries.length != 1;
    }

    if (!this.showPanel) {
      this.onSubmitRole();
    }
    this.loadingService.hide();
  }

  get showPanel(): boolean {
    return this.showCountries || this.showBusiness || this.showProfile;
  }

  prfileUserGrup(businessId: any, securityUsersId: any): void {
    const data = {
      countryId: this.registerForm.get('countries').value,
      businessId: businessId,
      role: this.registerForm.get('profile_role').value,
    };
    this.storageService.addLanguage('en');
    this.storageService.addProfiles(data);

    if (this.profilesService.validateUserType()) {
      this.sharedService.customerIdGet(businessId, securityUsersId).subscribe(
        (response) => {
          if (response.status) {
            this.storageService.addGrup(response.data);
            this.storageService.addSecurityUsersId(securityUsersId);
            this.goPath();            
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
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
    } else {
      this.sharedService
        .zoneIdSalesExecutiveGroupIdGet(businessId, securityUsersId)
        .subscribe(
          (response) => {
            if (response.status) {
              this.storageService.addGrup(response.data);
              this.storageService.addSecurityUsersId(securityUsersId);              
              this.goPath();            
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.message,
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
  }

  goPath()
  {
    let pathEmail = this.cookieService.getCookie('pathEmail');
    if(pathEmail == '' || pathEmail == null)
    {      
      this.router.navigate(['/home']);
    }
    else
    {
      this.router.navigate([`${pathEmail}`]);
      this.cookieService.deleteCookie('pathEmail');            
    }        
  }

  onChangeCountries(value: any) {
    this.business = [];
    const filter = this.countries.filter((list) => list.countryId === value);
    this.business = filter[0].business;

    if (this.business.length == 1) {
      this.registerForm.controls.business_facility.setValue(
        this.business[0].businessId
      );
      this.showBusiness = false;
      this.onChangeBusiness(this.business[0].businessId);
    } else {
      this.showBusiness = true;
      this.registerForm.controls.business_facility.setValue('');
      this.showProfile = false;
      this.registerForm.controls.profile_role.setValue('');
    }
  }

  onChangeBusiness(value: string) {
    this.profile = [];
    const filter = this.business.filter((list) => list.businessId === value);
    this.profile = filter[0].groups;

    if (this.profile.length == 1) {
      this.registerForm.controls.profile_role.setValue(this.profile[0].groupId);
      this.showProfile = false;
    } else {
      this.showProfile = true;
      this.registerForm.controls.profile_role.setValue('');
    }
  }
}

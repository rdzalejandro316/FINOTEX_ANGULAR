import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfilesService } from 'src/app/core/services/profile/profiles.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { secrectKey } from 'src/app/shared/constant/customertype.enum';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  registerForm!: FormGroup;
  registerFormLogin: FormGroup;
  displayLogin = false;
  showError = false;
  showErrorText = '';
  titleLogin = '';
  userType = [
    {
      code: '1',
      name: 'Finotex customer',
    },
    {
      code: '2',
      name: 'Finotex team',
    },
  ];
  private key = CryptoJS.enc.Utf8.parse(secrectKey);
  private iv = CryptoJS.enc.Utf8.parse(secrectKey);

  constructor(
    private profilesService: ProfilesService,
    private router: Router,
    private storageService: StorageService,
    private formBuilder: FormBuilder
  ) {}
  get formControls() {
    return this.registerForm.controls;
  }
  ngOnInit(): void {
    this.getFormTypeUser();
    this.getFormLoginUser();
  }
  private getFormTypeUser() {
    return (this.registerForm = this.formBuilder.group({
      user_type: ['', Validators.required],
    }));
  }
  private getFormLoginUser() {
    return (this.registerFormLogin = this.formBuilder.group({
      username: [
        '',
        Validators.pattern('^[aA-zZ0-9._%+-]+@[aA-zZ0-9.-]+.[aA-zZ]{2,4}$'),
      ],
      password: ['', Validators.required],
    }));
  }
  onSubmitTypeUser(): void {
    this.displayLogin = true;
    this.titleLogin =
      this.formControls.user_type.value == 1
        ? 'Finotex customer'
        : 'Finotex team';
  }
  onSubmitLogin(): void {
    if (this.formControls.user_type.value == '1') {
      // USER EXTERNAL
      this.callServiceB2c();
    } else if (this.formControls.user_type.value == '2') {
      // USER INTERNAL
      this.callServiceB2b();
    }
  }
  encryptLoginData(data: any) {
    var encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(data),
      this.key,
      {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted;
  }
  decryptUsingAES256(decString) {
    var decrypted = CryptoJS.AES.decrypt(decString, this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  encryptLoginForm(): any {
    let user_generated_signature = this.encryptLoginData(
      this.registerFormLogin.controls.username.value
    ).toString();
    let passw_generated_signature = this.encryptLoginData(
      this.registerFormLogin.controls.password.value
    ).toString();
    let data = {
      username: user_generated_signature,
      password: passw_generated_signature,
    };
    return data;
  }
  callServiceB2c(): void {
    this.showError = false;
    this.profilesService.loginB2cGetFinotex(this.encryptLoginForm()).subscribe(
      (response) => {
        if (response.status) {
          this.setInfoLoginUser(response.data.access_token, response.data);
        }
      },
      (error) => {
        this.showError = true;
        this.showErrorText = error.error.message;
      },
      () => {
        this.displayLogin = false;
      }
    );
  }
  callServiceB2b(): void {
    this.showError = false;
    this.profilesService.loginB2bGetFinotex(this.encryptLoginForm()).subscribe(
      (response) => {
        if (response.status) {
          this.setInfoLoginUser(response.data.access_token, response.data);
        }
      },
      (error) => {
        this.showError = true;
        this.showErrorText = error.error.message;
      },
      () => {
        this.displayLogin = false;
      }
    );
  }
  setInfoLoginUser(token: string, user: any) {
    this.storageService.addToken(token);
    this.storageService.addUserType(this.formControls.user_type.value);
    this.storageService.addUser(user);
    this.router.navigate(['profiles_roles']);
  }
}

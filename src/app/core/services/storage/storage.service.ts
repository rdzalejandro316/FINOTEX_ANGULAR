import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import jwt_decode from "jwt-decode";
import { rolPqrs } from '../../../shared/constant/roleProfile';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private authService: MsalService,
    private router: Router,
  ) {

  }

  addToken(token: string): void {
    localStorage.setItem('finitex_t', JSON.stringify(token));
  }

  getToken(): string {
    return JSON.parse(localStorage.getItem('finitex_t'));
  }

  getUserLocal(): string {
    return JSON.parse(localStorage.getItem('finitex_t'));
  }

  addUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user'));
  }

  addLanguage(lang: string): void {
    localStorage.setItem('language', JSON.stringify(lang));
  }

  getLanguage(): string {
    return JSON.parse(localStorage.getItem('language'));
  }

  addUserType(type: number): void {
    localStorage.setItem('user_type', JSON.stringify(type));
  }

  getUserType(): string {
    return JSON.parse(localStorage.getItem('user_type'));
  }

  addGrup(data: any): void {
    localStorage.setItem('grupos', JSON.stringify(data));
  }

  getGrup(): any {
    return JSON.parse(localStorage.getItem('grupos'));
  }

  getGrupId(): any {
    return JSON.parse(localStorage.getItem('grupos'));
  }

  addArtwork(data: any): void {
    localStorage.setItem('artwork', JSON.stringify(data));
  }

  getArtwork(): any {
    return JSON.parse(localStorage.getItem('artwork'));
  }

  addProfiles(data: any): void {
    localStorage.setItem('profiles', JSON.stringify(data));
  }

  getProfiles(): any {
    return JSON.parse(localStorage.getItem('profiles'));
  }

  clearStorage(): void {
    localStorage.clear();
  }

  clearStorageSession(): void {
    sessionStorage.clear();
  }

  logoutUser(): void {
    this.clearStorage();
    this.clearStorageSession();
    this.router.navigate(['/login']);
  }

  logoutUserInterceptor(): void {
    this.clearStorageSession();
    this.router.navigate(['/login']);
  }

  addProductBrand(data: any): void {
    localStorage.setItem('productBrand', JSON.stringify(data));
  }

  getProductBrand(): any {
    return JSON.parse(localStorage.getItem('productBrand'));
  }

  addItemToBrandProductShoppingCart(data: any): void {
    localStorage.setItem('brandProductShoppingCart', JSON.stringify(data));
  }

  getItemFromBrandProductShoppingCart(): any {
    let brandProductShoppingCart = JSON.parse(localStorage.getItem('brandProductShoppingCart'));
    return brandProductShoppingCart ? brandProductShoppingCart : [];
  }

  removeBrandProductShoppingCart(): void {
    localStorage.removeItem('brandProductShoppingCart');
  }

  getSelectedSampleItem(): any{
    return JSON.parse(localStorage.getItem('SelectedSampleItem'));
  }

  getSamplesItems(): any{
    return JSON.parse(localStorage.getItem('SamplesItems'));
  }

  removeSamplesItems(): void{
    localStorage.removeItem('SamplesItems');
  }

  addSecurityUsersId(data: any): void {
    localStorage.setItem('securityUsersId', JSON.stringify(data));
  }

  getSecurityUsersId(): any {
    return JSON.parse(localStorage.getItem('securityUsersId'));
  }

  getProductLocalStorage(): any[] {
    return JSON.parse(localStorage.getItem('productsCart'));
  }

  addProductLocalStorage(data: any): void {
    localStorage.setItem('productsCart', JSON.stringify(data));
  }

  removeItemFinotex(key: string): void {
    localStorage.removeItem(key);
  }

  addShowPrice(data: any): void{
    localStorage.setItem('showPrice', JSON.stringify(data));
  }

  getShowPrice():any{
    return JSON.parse(localStorage.getItem('showPrice'));
  }

  getIsRolPqrs(): any{    
    var decoded = jwt_decode(this.getToken());
    if(decoded["groups"]){
      var groups = decoded['groups'];
      let isRolPqrs = groups.includes(rolPqrs);
      return isRolPqrs;
    }
    else{
      return false;
    }
  } 
}

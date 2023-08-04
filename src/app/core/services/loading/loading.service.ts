import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading$ = new Subject<boolean>();

  isDialog$ = new Subject<boolean>();

  constructor() { }

  show(): void {
    this.isLoading$.next(true);
  }

  hide(): void {
    this.isLoading$.next(false);
  }

  showDialog(): void {
    this.isDialog$.next(true);
  }

  hideDialog(): void {
    this.isDialog$.next(false);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RedisService {

  constructor(private http: HttpClient) { }

  get(data: any) {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Redis}/Redis/GetRedisSample`, data);
  }

  set(data: any) {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Redis}/Redis/SetRedisSample`, data);
  }
}

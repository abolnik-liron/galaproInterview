import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HomeProvider {

  constructor(public http: HttpClient) {
  }
  url = "http://localhost:8080";

  getVarifiedUrl(data) {
    let body = {
      data:data
    }
  return this.http.post(`${this.url}/verifyUrl`,body);
  }
}

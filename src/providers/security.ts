import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Promise} from 'es6-promise';
import {Storage} from '@ionic/storage';
import {JwtHelper} from 'angular2-jwt';

/*
  Generated class for the Security provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Security {

  private host = "http://127.0.0.1:3000/api";
  private loginURI = "/auth/login";

  private storage = new Storage();
  private decodeToken = new JwtHelper().decodeToken;

  constructor(public http: Http) {}

  encode(part:string) {
    return encodeURIComponent(part).replace("%20","+");
  }

  private storeToken(token:string) {
    this.storage.set('id_token',token);
    this.storage.set('user',this.decodeToken(token));
  }

  login(username: string, password:string):Promise<boolean> {
    let headers = new Headers();
    headers.append("Content-Type",'application/x-www-form-urlencoded');
    return this.http.post(this.host+this.loginURI,
      `username=${this.encode(username)}&password=${this.encode(password)}`,
      {headers: headers}
    ).map((res) => res.json().token).toPromise().then(this.storeToken).then(()=>true);
  }

}

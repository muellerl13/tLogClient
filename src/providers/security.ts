import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Promise} from 'es6-promise';
import {Storage} from '@ionic/storage';
import {JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {User} from "../models/user";

/*
  Generated class for the Security provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Security {

  private host = "http://127.0.0.1:3000/api";
  private loginURI = "/auth/login";
  private registerURI = "/auth/signup";

  private storage = new Storage();


  constructor(public http: Http) {}

  static encode(part:string) {
    return encodeURIComponent(part).replace("%20","+");
  }

  getToken() { return this.storage.get('id_token');}
  getUser() {return this.storage.get('user');}
  isTokenExpired() {
    return this.getToken().then(token => !token || new JwtHelper().isTokenExpired(token))
  }

  static loggedIn() {return tokenNotExpired();}

  storeToken(token:string) {
    this.storage.set('id_token',token);
    this.storage.set('user',new JwtHelper().decodeToken(token));
  }



  login(username: string, password:string):Promise<boolean> {
    let headers = new Headers();
    headers.append("Content-Type",'application/x-www-form-urlencoded');
    return this.http.post(this.host+this.loginURI,
      `username=${Security.encode(username)}&password=${Security.encode(password)}`,
      {headers: headers}
    ).toPromise().then((res) => res.json().token).then(this.storeToken.bind(this)).then(()=>true);
  }

  register(user:User):Promise<boolean> {
    const store = this.storeToken
    return this.http.post(this.host+this.registerURI,user).toPromise().then((res) => res.json().token).then(store.bind(this)).then(()=>true);
  }

}

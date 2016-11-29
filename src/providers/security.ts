import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Promise} from 'es6-promise';
import {Storage} from '@ionic/storage';
import {JwtHelper, AuthHttp} from 'angular2-jwt';
import {User} from "../models/user";

/*
  Generated class for the Security provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Security {

  private host = "http://10.12.200.28:3000/api";
  private loginURI = "/auth/login";
  private registerURI = "/auth/signup";

  private storage = new Storage();


  constructor(public http: Http, private auth: AuthHttp ) {}

  static encode(part:string) {
    return encodeURIComponent(part).replace("%20","+");
  }

  private jwtHelper = new JwtHelper();


  getToken = ():Promise<string> => this.storage.get('id_token');
  getUser = ():Promise<User> => this.storage.get('user');


  whoami = () => this.auth.get(this.host+"/auth/me").toPromise().then(res => res.json());


  loggedIn = ():Promise<boolean> => this.getToken().then(token => !token || this.jwtHelper.isTokenExpired(token));

  storeToken = (token:string):Promise<boolean> =>
    Promise.all([
    this.storage.set('id_token',token),
    this.storage.set('user',new JwtHelper().decodeToken(token))]).then(()=>true)




  login = (username: string, password:string):Promise<boolean> => {
    let headers = new Headers();
    headers.append("Content-Type",'application/x-www-form-urlencoded');
    return this.http.post(this.host+this.loginURI,
      `username=${Security.encode(username)}&password=${Security.encode(password)}`,
      {headers: headers}
    ).toPromise().then((res) => res.json().token).then(this.storeToken).then(()=>true);
  }

  register = (user:User):Promise<boolean> => this.http.post(this.host+this.registerURI,user).toPromise().then((res) => res.json().token).then(this.storeToken);


}

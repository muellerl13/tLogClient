import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the Serverconfig provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Serverconfig {

  private _host = "http://127.0.0.1:3000/api";
  //private _host = "http://10.15.200.163:3000/api";
  private _loginURI = `${this._host}/auth/login`;
  private _registerURI = `${this._host}/auth/signup`;
  private _mineURI = `${this._host}/trip/mine`;
  private _tripURI = `${this._host}/trip`;
  private _poiURI = `${this.host}/poi`;
  private _userURI = `${this.host}/user`;
  private _ownPoiURI = `${this.host}/poi/mine`;
  private _allPoisURI = `${this.host}/poi`;
  private _deletePOI = `${this.host}/poi`;
  private _deleteImage = `${this.host}/poi/image`;

  public get host():string {return this._host};
  public get loginURI():string {return this._loginURI};
  public get registerURI():string {return this._registerURI};
  public get mineURI() {return this._mineURI};
  public get tripURI () {return this._tripURI};
  public get poiURI() {return this._poiURI};
  public get userURI() {return this._userURI};
  public get ownPoiURI(){return this._ownPoiURI};
  public get allPoisURI(){return this._allPoisURI};
  public get deletePOI(){return this._deletePOI};
  public get deleteImage(){return this._deleteImage};

  constructor() {
  }

}

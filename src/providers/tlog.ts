import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {AuthHttp} from "angular2-jwt";
import {Promise} from "es6-promise";
import {Serverconfig} from "./serverconfig";
import {Trip} from '../models/models';

/*
  Generated class for the Tlog provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Tlog {

  constructor(private authHttp: AuthHttp, private serverconfig: Serverconfig) {

  }

  getTrips = ():Promise<Array<Trip>> => this.authHttp.get(this.serverconfig.mineURI).toPromise().then((res)=>res.json());

  loadTrip = (tripID:string):Promise<Trip> =>
    this.authHttp.get(`${this.serverconfig.tripURI}/${tripID}`)
      .toPromise().then(res => res.json());

  addTrip = (trip:Trip):Promise<Trip> =>
    this.authHttp.post(this.serverconfig.tripURI,trip).toPromise()
      .then(res => res.json());

  loadTrip = (tripID:string):Promise<Trip> =>
    this.authHttp.get(`${this.serverconfig.tripURI}/${tripID}`)
      .toPromise().then(res => res.json());
}

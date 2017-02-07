import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {AuthHttp} from "angular2-jwt";
import {Promise} from "es6-promise";
import {Serverconfig} from "./serverconfig";
import {Trip, POI, User} from '../models/models';
import {Security} from "./security";


/*
 Generated class for the Tlog provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class Tlog {

  constructor(private authHttp: AuthHttp,
              private serverconfig: Serverconfig,
              private security: Security) {

  }

  getTrips = (): Promise<Array<Trip>> => this.authHttp.get(this.serverconfig.mineURI).toPromise().then((res) => res.json());

  getMyPois = (): Promise<Array<POI>> => this.authHttp.get(this.serverconfig.ownPoiURI).toPromise().then((res) => res.json());

  likeDislikeTrip = (tripID: string) : Promise<Trip> =>
    this.authHttp.patch(`${this.serverconfig.tripURI}/${tripID}/like`,{})
      .toPromise().then(res =>res.json());

  commentOnTrip = (tripID: string, comment:Comment) : Promise<Trip> =>
    this.authHttp.post(`${this.serverconfig.tripURI}/${tripID}/comment`,comment)
      .toPromise().then(res =>res.json());

  filterImage = (poiId, filterType, imageId):Promise<POI> => this.authHttp.patch(`${this.serverconfig.poiURI}/${poiId}/filterImage`,{"filterType":filterType,"imageId":imageId}).toPromise().then((res) => res.json());

  deleteImage = (imageId, poi:POI):Promise<POI> => this.authHttp.delete(`${this.serverconfig.poiURI}/${poi._id}/image/${imageId}`).toPromise().then((res) => res.json());

  getAllTrips = (): Promise<Array<Trip>> => this.authHttp.get(this.serverconfig.tripURI).toPromise().then((res) => res.json());

  deletePoi = (poi:POI): Promise<POI> => this.authHttp.delete(`${this.serverconfig.deletePOI}/${poi._id}`).toPromise().then((res) => res.json());

  deleteTrip = (trip:Trip): Promise<Trip> => this.authHttp.delete(`${this.serverconfig.tripURI}/${trip._id}`).toPromise().then((res) => res.json());

  getAllPois = (): Promise<Array<POI>> => this.authHttp.get(this.serverconfig.allPoisURI).toPromise().then((res) => res.json());

  addTrip = (trip: Trip): Promise<Trip> =>
    this.authHttp.post(this.serverconfig.tripURI, trip).toPromise()
      .then(res => res.json());

  loadTrip = (tripID: string): Promise<Trip> =>
    this.authHttp.get(`${this.serverconfig.tripURI}/${tripID}`)
      .toPromise().then(res => res.json());

  addPOI = (tripID: string, poi: POI): Promise<POI> =>
    this.authHttp.post(`${this.serverconfig.tripURI}/addpoi/${tripID}`, poi)
      .toPromise().then(res => res.json());


  updatePOI = (tripID: string, poi: POI): Promise<POI> =>
    this.authHttp.patch(`${this.serverconfig.poiURI}/${poi._id}`, poi)
      .toPromise().then(res => {
      console.log("GOT UPDATE RESPONSE: " + res.json());
      return res.json()
    });

  updateTrip = (trip: Trip): Promise<Trip> =>
    this.authHttp.patch(`${this.serverconfig.tripURI}/${trip._id}`, trip)
      .toPromise().then(res => {
      console.log("GOT UPDATE RESPONSE: " + res.json());
      return res.json()
    });

  updateUser = (userID: string, user: User): Promise<User> =>
    this.authHttp.patch(`${this.serverconfig.userURI}/${userID}`, user)
      .toPromise().then(res => {
      console.log("GOT UPDATE RESPONSE: " + res.json());
      return res.json()
    });

  getImage = (imageId: string) =>
    this.authHttp.get(`${this.serverconfig.poiURI}/image/${imageId}`).toPromise();

  getImageURL = (imageId: string): Promise<string> => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    this.security.getToken()
      .then(token => {
        xhr.open("GET", `${this.serverconfig.poiURI}/image/${imageId}`);
        xhr.setRequestHeader("authorization", `Bearer ${token}`);
        xhr.responseType = "arraybuffer";
        xhr.onload = function (e) {
          // Obtain a blob: URL for the image data.
          let arrayBufferView = new Uint8Array(this.response);
          let blob = new Blob([arrayBufferView], {type: "image/jpeg"});
          let urlCreator = window.URL || (window as any).webkitURL;
          let imageUrl = urlCreator.createObjectURL(blob);
          resolve(imageUrl);
        };

        xhr.send();
      });
  });

}

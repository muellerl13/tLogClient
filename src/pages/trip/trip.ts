import { Component } from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import 'leaflet';
import 'drmonty-leaflet-awesome-markers';
import {Tlog} from "../../providers/tlog";
import { Geolocation } from 'ionic-native';
/*
  Generated class for the Trip page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-trip',
  templateUrl: 'trip.html'
})
export class TripPage {

  defaultLocation:L.LatLng =  new L.LatLng(47.0720698,15.4429915);
  center:L.LatLng = this.defaultLocation;
  map:L.Map;
  currentLocationMarker: L.Marker;
  currentLocationIcon: L.AwesomeMarkers.Icon;

  constructor(
      public navCtrl: NavController,
      private tlogService: Tlog,
      private alertCtrl: AlertController,
      private navParams: NavParams,
      private loadingCtrl: LoadingController
  ) {
    this.currentLocationIcon = L.AwesomeMarkers.icon({
      icon: 'coffee',
      markerColor: 'red'
    });
  }




  showAlert = (title:string,message:string) =>
    this.alertCtrl.create({title: title, message: message, buttons: ['OK']}).present();

  initMap = () => {
    if (this.map) this.map.remove();
    this.map = L.map("map").setView(this.center,13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    if (this.currentLocationMarker) {
      this.currentLocationMarker.addTo(this.map);
      this.currentLocationMarker.bindPopup("<h4>Your are here!</h4>").openPopup();
    }
  };

  ionViewDidLoad() {

  }

  getCurrentPosition = () => {
    let loader = this.loadingCtrl.create({content: "Trying to determine you current location ...."});
    loader.present();
    Geolocation.getCurrentPosition()
      .then(resp => {
        loader.dismiss();
        this.center = new L.LatLng(resp.coords.latitude,resp.coords.longitude);
        this.currentLocationMarker = L.marker(this.center,{icon: this.currentLocationIcon});
        this.initMap();
      })
      .catch(err => {
        loader.dismiss();
        this.center = this.defaultLocation;
        this.showAlert("INFO","Could not get your position, using a default location instead.");
        this.currentLocationMarker = L.marker(this.center,{icon: this.currentLocationIcon});
        this.initMap();
      })
  };

  ionViewWillEnter = () =>
    this.tlogService.loadTrip(this.navParams.get("tripID"))
      .then(trip => {if (trip.pois.length ===0) this.getCurrentPosition()})
      .catch(err => this.showAlert("ERROR",`Could not load this Trip (${err})`))


}

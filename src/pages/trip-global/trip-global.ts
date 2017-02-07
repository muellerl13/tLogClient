import {Component} from '@angular/core';
import {NavController, AlertController, NavParams, LoadingController, ActionSheetController} from 'ionic-angular';
import {Geolocation, ActionSheet} from "ionic-native";
import "leaflet";
import "drmonty-leaflet-awesome-markers/js/leaflet.awesome-markers"
import {Tlog} from "../../providers/tlog";
import {Trip, POI} from "../../models/models";
import {ShowPoiPage} from "../show-poi/show-poi";


@Component({
  selector: 'page-trip-global',
  templateUrl: 'trip-global.html'
})
export class TripGlobalPage {

  defaultLocation:L.LatLng =  new L.LatLng(47.0720698,15.4429915);
  center:L.LatLng = this.defaultLocation;
  map: L.Map;
  currentLocationMarker: L.Marker;
  markers: L.Marker[];
  trip: Trip = new Trip();
  path:L.Polyline;

  constructor(public navCtrl: NavController,
              private alertCtrl: AlertController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private tlog: Tlog,
              private asCtrl: ActionSheetController
  ) {
  }

  presentPOIActionSheet = (poi:POI):ActionSheet =>
    this.asCtrl.create({
      //title: 'Modify your album',
      buttons: [
        {
          text: 'Show Details',
          handler: () => {
            this.showPoi(poi);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    }).present();

    showAlert = (title: string, message: string) => this.alertCtrl.create({
    title: title,
    message: message,
    buttons: ['OK']
  }).present();

  poiToLatLng = (poi: POI) => L.latLng(poi.loc.coordinates[1], poi.loc.coordinates[0]);
  poiToCoords = (poi: POI) => L.marker(this.poiToLatLng(poi)
    /*,
     {icon: (poi.images.length>0)?this.pictureIcon:this.standardIcon}
     */
  )
    .on('popupopen',this.onPopupOpen(poi));


  initMap = () => {
    if (this.map) this.map.remove();
    if (this.trip.pois.length > 0) this.center = this.poiToLatLng(this.trip.pois[this.trip.pois.length - 1]);
    this.map = L
      .map("map")
      .setView(this.center, 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.markers = this.trip.pois.map(poi => this.poiToCoords(poi).bindPopup(`<h4>${poi.name}</h4><p>${poi.description}</p>`));
    this.path = new L.Polyline(this.markers.map(m=>m.getLatLng()));
    this.map.addLayer(this.path);
    this.markers.forEach(m => m.addTo(this.map));
  };

  centerMap = (pos: L.LatLng) => {
    if (!this.map) this.initMap();
    this.map.panTo(pos);
  };

  onMapClicked = (e) => {
    console.log("Map Clicked");
  };

  onPopupOpen = (poi:POI) => (e:L.LeafletPopupEvent) => {
    this.map.panTo(e.target.getLatLng());
    this.presentPOIActionSheet(poi);
  };

  showPoi = (poi) => this.navCtrl.push(ShowPoiPage,{
    poi:poi
  });


  ionViewWillEnter = () => {
    if (this.currentLocationMarker) {
      this.map.removeLayer(this.currentLocationMarker);
      this.currentLocationMarker = null;
    }
    console.log('Hello TripPage Page to show: ' + this.navParams.get("trip"));
    this.tlog.loadTrip(this.navParams.get("trip"))
      .then(trip => {
        this.trip = trip;
        if (this.trip.pois.length === 0) this.getCurrentPosition(); else this.initMap()
      })
  };

  getCurrentPosition = () => {
    let loader = this.loadingCtrl.create({content: "Trying to determine your current location ...."});
    loader.present();
    Geolocation.getCurrentPosition()
      .then(resp => {
        loader.dismiss();
        this.center = new L.LatLng(resp.coords.latitude,resp.coords.longitude);
        this.centerMap(this.center);
      })
      .catch(err => {
        loader.dismiss();
        this.center = this.defaultLocation;
        this.showAlert("INFO","Could not get your position, using a default location instead.");
        this.centerMap(this.center);
      })
  };
}


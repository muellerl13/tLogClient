import {Component} from '@angular/core';
import {NavController, AlertController, NavParams, LoadingController, ActionSheetController} from 'ionic-angular';
import {Geolocation, Coordinates} from "ionic-native";
import "leaflet";
import "drmonty-leaflet-awesome-markers/js/leaflet.awesome-markers"
import {Tlog} from "../../providers/tlog";
import {Trip, POI} from "../../models/models";
import {AddPoiPage} from "../add-poi/add-poi";


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

  center: L.LatLng;
  map: L.Map;
  currentLocationMarker: L.Marker;
  markers: L.Marker[];
  currentMarkerIcon: any;
  trip: Trip = new Trip();
  path:L.Polyline;
  currentLocationMarkerOptions: L.AwesomeMarkers.IconOptions = {iconUrl: null, icon: "hand-o-down", markerColor: "red"};

  constructor(public navCtrl: NavController,
              private alertCtrl: AlertController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private tlog: Tlog,
              private asCtrl: ActionSheetController
             ) {
    L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
    this.currentMarkerIcon = L.AwesomeMarkers.icon(this.currentLocationMarkerOptions);

  }

  presentNewPOIActionSheet = () => {
    let actionSheet = this.asCtrl.create({
      //title: 'Modify your album',
      buttons: [
        {
          text: 'Add POI',
          handler: () => {
            this.addPOI();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
  }

  showAlert = (title: string, message: string) => this.alertCtrl.create({
    title: title,
    message: message,
    buttons: ['OK']
  }).present();

  getCurrentLocation = (): Promise<Coordinates> => {
    const loading = this.loadingCtrl.create({content: "Trying to determine your current position"});
    loading.present();
    return Geolocation.getCurrentPosition()
      .then(pos => {
        this.center = L.latLng(pos.coords.latitude, pos.coords.longitude);
        if (!this.map) this.initMap();
        this.map.panTo(this.center);
        this.currentLocationMarker = this.addCurrentLocationMarker(this.center);
        this.currentLocationMarker.bindPopup("You are here").openPopup();
        loading.dismiss();
        this.presentNewPOIActionSheet();
        return L.latLng(pos.coords.latitude, pos.coords.longitude);
      })
      .catch(err => {
        loading.dismiss();
        this.showAlert("ERROR", `Could not retrieve your position (${err.message || err})`);
        return Promise.reject(err);
      })
  };

  poiToLatLng = (poi: POI) => L.latLng(poi.loc.coordinates[1], poi.loc.coordinates[0]);
  poiToCoords = (poi: POI) => L.marker(this.poiToLatLng(poi)).on('popupopen',this.onPopupOpen);


  initMap = () => {
    if (this.trip.pois.length > 0) this.center = this.poiToLatLng(this.trip.pois[this.trip.pois.length - 1]);
    if (this.map) this.map.panTo(this.center)
    else {
      this.map = L
        .map("map")
        .setView(this.center, 13);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
    }
    if (this.markers) this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = this.trip.pois.map(poi => this.poiToCoords(poi).bindPopup(poi.name));
    this.path = new L.Polyline(this.markers.map(m=>m.getLatLng()));
    this.map.addLayer(this.path);
    this.markers.forEach(m => m.addTo(this.map));


  };

  addCurrentLocationMarker = (pos: L.LatLng) =>
    L.marker(pos, {draggable: true, icon: this.currentMarkerIcon})
      .on("dragend", this.onMarkerPositionChanged.bind(this))
      .addTo(this.map);

  onMapClicked = (e) => {
    console.log("Map Clicked");
  };

  onMarkerPositionChanged = (e) => {
    console.log("Marker dragged");
  };

  onPopupOpen = (e:L.LeafletPopupEvent) =>
    this.map.panTo(e.target.getLatLng());

  addPOI = () => this.navCtrl.push(AddPoiPage,
    {
      tripID: this.trip._id,
      coordinates: this.currentLocationMarker.getLatLng()
    });

  loadTrip = (tripID: string) => this.tlog.loadTrip(tripID)
    .then(trip => this.trip = trip);

  ionViewWillEnter = () => {
    if (this.currentLocationMarker) {
      this.map.removeLayer(this.currentLocationMarker);
      this.currentLocationMarker = null;
    }
    console.log('Hello TripPage Page to show: ' + this.navParams.get("trip"));
    this.loadTrip(this.navParams.get("trip"))
      .then(() => {
        if (this.trip.pois.length === 0) this.getCurrentLocation(); else this.initMap()
      })
  }

}

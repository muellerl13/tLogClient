import {Component} from '@angular/core';
import {NavController, AlertController, NavParams, LoadingController, ActionSheetController} from 'ionic-angular';
import {Geolocation} from "ionic-native";
import "leaflet";
import "drmonty-leaflet-awesome-markers/js/leaflet.awesome-markers"
import {Tlog} from "../../providers/tlog";
import {Trip, POI} from "../../models/models";



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
  map: L.Map;
  currentLocationMarker: L.Marker;
  currentLocationIcon: L.AwesomeMarkers.Icon;
  trip: Trip = new Trip();
  currentLocationMarkerOptions: L.AwesomeMarkers.IconOptions =
    {iconUrl: null, icon: "hand-o-down", markerColor: "red"};

  constructor(public navCtrl: NavController,
              private alertCtrl: AlertController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private tlog: Tlog,
              private asCtrl: ActionSheetController
             ) {
    L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
    this.currentLocationIcon = L.AwesomeMarkers.icon({
      icon: 'hand-o-down',
      markerColor: 'red'
    });
  }

  presentNewPOIActionSheet = () => {
    let actionSheet = this.asCtrl.create({
      //title: 'Modify your album',
      buttons: [
        {
          text: 'Add POI',
          handler: () => {

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
  };

  showAlert = (title: string, message: string) => this.alertCtrl.create({
    title: title,
    message: message,
    buttons: ['OK']
  }).present();



  poiToLatLng = (poi: POI) => L.latLng(poi.loc.coordinates[1], poi.loc.coordinates[0]);
  poiToCoords = (poi: POI) => L.marker(this.poiToLatLng(poi)).on('popupopen',this.onPopupOpen);


  initMap = () => {
    if (this.map) this.map.remove();
    if (this.trip.pois.length > 0) this.center = this.poiToLatLng(this.trip.pois[this.trip.pois.length - 1]);
    this.map = L
        .map("map")
        .setView(this.center, 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  };

  addCurrentLocationMarker = (pos: L.LatLng) => {
    if (!this.map) this.initMap();
    this.currentLocationMarker = L.marker(pos, {draggable: true, icon: this.currentLocationIcon})
      .bindPopup("<h3>You are here</h3><p>You can drag this marker. Press the '+' Icon in the Task Bar to add this POI.</p>")
      .addTo(this.map);
    this.currentLocationMarker.openPopup()
    this.currentLocationMarker.on("dragend", this.onMarkerPositionChanged.bind(this))

  };

  onMapClicked = (e) => {
    console.log("Map Clicked");
  };

  onMarkerPositionChanged = (e) => {
    console.log("Marker dragged");
  };

  onPopupOpen = (e:L.LeafletPopupEvent) =>
    this.map.panTo(e.target.getLatLng());



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
        this.addCurrentLocationMarker(this.center);
      })
      .catch(err => {
        loader.dismiss();
        this.center = this.defaultLocation;
        this.showAlert("INFO","Could not get your position, using a default location instead.");
        this.addCurrentLocationMarker(this.center);
      })
  };


}

import { Component } from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import {TripPage} from "../trip/trip";
import {LoginPage} from "../login/login";
import {AddTripPage} from "../add-trip/add-trip";
import {Security} from "../../providers/security";
import {Tlog} from "../../providers/tlog";
import {Trip} from "../../models/models";

/*
  Generated class for the ListAllTrips page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-list-all-trips',
  templateUrl: 'list-all-trips.html'
})
export class ListAllTripsPage {

  selectedItem: any;
  icons: string[];
  items: Array<Trip>;

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  private security: Security,
  private tLogService: Tlog,
  private alertCtrl: AlertController,
  private loadingCtrl: LoadingController) {
    this.selectedItem = navParams.get('item');
    this.items = [];
  }

  ionViewDidLoad() {
  }

  addTrip = () => this.navCtrl.push(AddTripPage);

  showAlert = (title: string, message: string) => this.alertCtrl.create({
    title: title,
    message: message,
    buttons: ['OK']
  }).present();

  loadTrips = () => {
    const loading = this.loadingCtrl.create({
      content: "Fetching your trips"
    });
    loading.present()
      .then(this.tLogService.getAllTrips)
      .then(trips => this.items = trips).then(() => {
      loading.dismiss();
      if (this.items.length === 0) {
        this.showAlert("INFO", "You do not have any trips yet. Press the Plus Icon to create one.")
      }
    })
      .catch(err => {
        loading.dismiss();
        this.showAlert("Error", `Could not retrieve list of trips: ${err.message || err}`);
      });
  }

  ionViewWillEnter = () => {
    this.security.isNotloggedIn().then(exp => {
      if (exp) this.navCtrl.setRoot(LoginPage); else this.loadTrips()
    });
  }

  itemTapped(event, tripID) {
    this.navCtrl.push(TripPage, {
      trip: tripID
    });
  }
}

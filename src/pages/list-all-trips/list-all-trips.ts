import { Component } from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {Security} from "../../providers/security";
import {Tlog} from "../../providers/tlog";
import {Trip, User} from "../../models/models";
import {TripGlobalPage} from "../trip-global/trip-global";


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
  user: User = new User();
  tripsSearched: Array<Trip>;

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  private security: Security,
  private tLogService: Tlog,
  private alertCtrl: AlertController,
  private loadingCtrl: LoadingController) {
    this.selectedItem = navParams.get('item');
    this.items = [];
    this.tripsSearched = [];
  }

  ionViewDidLoad() {
    this.security.getUser()
      .then((rUser)=> {
        this.user = rUser
      })
      .catch((err) => {
        this.showAlert("Error",`Could not retrieve user: ${err._body}`)}
      );
  }

  save = (tripID,liked) => this.tLogService.likeDislikeTrip(tripID)
    .then(
      trip => console.log("save worked and this is trip :"+trip.name+" "+liked)
    )
    .catch(
      err => this.showAlert("ERROR",`${err.json().message}`)
    );

  getSearchedTrips(ev:any){
    this.tripsSearched = this.items;
    let valueSearchbar = ev.target.value;
    if (valueSearchbar && valueSearchbar.trim() != '') {
      this.tripsSearched = this.tripsSearched.filter((items) => {
        return (items.name.toLowerCase().indexOf(valueSearchbar.toLocaleLowerCase()) > -1);
      })
    }
  }

  like(tripID,liked){
    console.log("oh you like )" +tripID + liked);
    this.save(tripID,liked);
  }

  dislike(tripID,liked){
    console.log("oh you don't like )" +tripID + liked);
    this.save(tripID,liked);
  }

  //addComment(tripID)

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
      this.tripsSearched = this.items;
      loading.dismiss();
      if (this.items.length === 0) {
        this.showAlert("INFO", "You do not have any trips yet. Press the Plus Icon to create one.")
      }
      else{
     //   for (i = 0, len = this.items.length; i < len; i++) {

     //   }
      }
    })
      .catch(err => {
        loading.dismiss();
        this.showAlert("Error", `Could not retrieve list of trips: ${err.message || err}`);
      });
  };

  ionViewWillEnter = () => {
    this.security.isNotloggedIn().then(exp => {
      if (exp) this.navCtrl.setRoot(LoginPage); else this.loadTrips()
    });
  };

  itemTapped(event, tripID) {
    this.navCtrl.push(TripGlobalPage, {
      trip: tripID
    });
  }
}

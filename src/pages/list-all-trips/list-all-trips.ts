import { Component } from '@angular/core';
import {
  NavController, NavParams, AlertController, LoadingController, ActionSheet,
  ActionSheetController
} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {Security} from "../../providers/security";
import {Tlog} from "../../providers/tlog";
import {Trip, User} from "../../models/models";
import {TripGlobalPage} from "../trip-global/trip-global";
import {AddCommentPage} from "../add-comment/add-comment";


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
  private loadingCtrl: LoadingController, private asCtrl: ActionSheetController) {
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
      trip => {console.log("save worked and this is trip :"+trip.name+" "+liked)
               let index = this.tripsSearched.map(tripR=>tripR._id).indexOf(trip._id);
               this.tripsSearched[index] = trip;
      }
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

  likeTrip(tripId,liked){
    if(liked == true){
      liked = false;
    }else if(liked == false){
      liked = true;
    }
    this.save(tripId, liked);
  }

  addComment = (tripID) => this.navCtrl.push(AddCommentPage, {tripID: tripID});

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

  presentTripActionSheet = (tripID):ActionSheet =>
    this.asCtrl.create({
      buttons: [
        {
          text: 'Show on Map',
          handler: () => {
            this.showTrip(tripID);
          }
        },
        {
          text: 'Show Details',
          handler: () => {
            //this.showTripDetails(tripID);
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    })

  ionViewWillEnter = () => {
    this.security.isNotloggedIn().then(exp => {
      if (exp) this.navCtrl.setRoot(LoginPage); else this.loadTrips()
    });
  };

  showTrip = (tripID) => this.navCtrl.push(TripGlobalPage, {
    trip: tripID
  });

  itemTapped(event, tripID) {
    this.presentTripActionSheet(tripID).present();
  }
}

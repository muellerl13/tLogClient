import { Component } from '@angular/core';

import {
  NavController, NavParams, AlertController, LoadingController, ActionSheet,
  ActionSheetController
} from 'ionic-angular';

import {Security} from '../../providers/security';
import {LoginPage} from "../login/login";
import {Trip, User} from "../../models/models";
import {Tlog} from "../../providers/tlog";
import {AddTripPage} from "../add-trip/add-trip";
import {TripPage} from "../trip/trip";
import {ShowTripPage} from "../show-trip/show-trip";



@Component({
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<Trip>;
  tripsSearched: Array<Trip>;
  user: User = new User();


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private security: Security,
              private tLogService: Tlog,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private asCtrl: ActionSheetController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.items = [];
    this.tripsSearched = [];
  }

  addTrip = () => this.navCtrl.push(AddTripPage)

  showAlert = (title: string, message: string) => this.alertCtrl.create({
    title: title,
    message: message,
    buttons: ['OK']
  }).present();

  getSearchedTrips(ev:any){
    this.tripsSearched = this.items;
    let valueSearchbar = ev.target.value;
    if (valueSearchbar && valueSearchbar.trim() != '') {
      this.tripsSearched = this.tripsSearched.filter((items) => {
        return (items.name.toLowerCase().indexOf(valueSearchbar.toLocaleLowerCase()) > -1);
      })
    }
  }

  loadTrips = () => {
    const loading = this.loadingCtrl.create({
      content: "Fetching your trips"
    });
    loading.present()
      .then(this.tLogService.getTrips)
      .then(trips => this.items = trips).then(() => {
      this.tripsSearched = this.items;
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

  ionViewDidEnter = () => {

    this.security.getUser()
      .then((rUser)=> {
        this.user = rUser
        this.tLogService.getNotifications(this.user.id)
          .then(trips =>{
            let output = ""
            if (trips.length>0){
              for (let i = 0 ; i < trips.length; i++) {
                output+=trips[i].tripname+" "
              }
              this.showAlert("You have new likes",output)
            }

      })
      .catch((err) => {
        this.showAlert("Error",`Could not retrieve user: ${err._body}`)}
      );


  })}

  showTrip = (tripID) => this.navCtrl.push(TripPage,{
    trip:tripID
  });

  showTripDetails = (tripID) => this.navCtrl.push(ShowTripPage,{
    trip:tripID
  });

  editTrip = (tripID) => this.navCtrl.push(AddTripPage,{
    trip:tripID
  });

  deleteTrip = (tripID) => {
    this.tLogService.loadTrip(tripID).then(trip => this.tLogService.deleteTrip(trip))
      .then(deletedTrip => {
        this.showAlert("Delete",`${deletedTrip.name} was successfully deleted`);
        this.loadTrips();
      })
      .catch(err => {
        this.showAlert("Error", `Could not delete Trip: ${err.json().message}`)
      })
  }

  itemTapped(event, tripID) {
    this.presentTripActionSheet(tripID).present();
  }

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
            this.showTripDetails(tripID);
          }
        },
        {
          text: 'Edit Trip',
          handler: () => {
            this.editTrip(tripID);
          }
        },
        {
          text: 'Delete Trip',
          handler: () => {
            this.deleteTrip(tripID);
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    })
}

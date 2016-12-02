import { Component } from '@angular/core';

import {NavController, NavParams, AlertController} from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';
import {Security} from '../../providers/security';
import {LoginPage} from "../login/login";
import {Trip} from "../../models/models";
import {Tlog} from "../../providers/tlog";
import {AddTripPage} from "../add-trip/add-trip";



@Component({
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<Trip>;


  constructor(public navCtrl: NavController, public navParams: NavParams, private security: Security, private tLogService: Tlog, private alertCtrl: AlertController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];

  }

  addTrip = () => this.navCtrl.push(AddTripPage)

  showAlert = (title:string,message:string) => this.alertCtrl.create({title: title, message: message, buttons: ['OK']}).present();

  loadTrips = () => this.tLogService.getTrips()
    .then(trips => this.items=trips).then(() => {console.log(`length of items = ${this.items.length}`);if (this.items.length === 0) {this.showAlert("INFO","You do not have any trips yet. Press the Plus Icon to create one.") }} )
    .catch(err =>
      this.showAlert("Error",`Could not retrieve list of trips: ${err.message || err}`)
    );

  ionViewWillEnter = () => {
    this.security.loggedIn().then(exp => {if (exp) this.navCtrl.setRoot(LoginPage); else this.loadTrips()});
  }

  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }
}

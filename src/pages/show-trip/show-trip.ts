import { Component } from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {Trip, User} from "../../models/models";
import {Tlog} from "../../providers/tlog";
import {Security} from "../../providers/security";

/*
  Generated class for the ShowTrip page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-show-trip',
  templateUrl: 'show-trip.html'
})
export class ShowTripPage {

  trip: Trip = new Trip();
  comments:any;
  user:User;

  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              private security: Security,
              private alertCtrl:AlertController,
              public tlog: Tlog) {
  }

  ngOnInit() {
    this.tlog.loadTrip(this.navParams.get("trip"))
      .then(trip => {this.trip = trip;})
      .then(() => this.comments = this.trip.comments)
  }

  goBack = () => this.navCtrl.pop();

}

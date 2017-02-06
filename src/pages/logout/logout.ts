import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Security} from "../../providers/security";
import {LoginPage} from "../login/login";

/*
  Generated class for the Logout page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html'
})
export class LogoutPage {

  constructor(public navCtrl: NavController, private security: Security) {}

  ionViewDidLoad() {
    console.log('Hello LogoutPage Page');
    this.security.logout();
    this.navCtrl.setRoot(LoginPage)
  }

}

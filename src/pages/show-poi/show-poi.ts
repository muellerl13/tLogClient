import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {POI} from "../../models/models";

/*
  Generated class for the ShowPoi page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-show-poi',
  templateUrl: 'show-poi.html'
})
export class ShowPoiPage {

  poi: POI = new POI();


  constructor(public navCtrl: NavController,private navParams: NavParams) {}

  ngOnInit() {
    this.poi = this.navParams.get("poi");
  }

}

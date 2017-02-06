import { Component } from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import {POI} from "../../models/models";
import {Tlog} from "../../providers/tlog";
import {Security} from "../../providers/security";
import {ShowPoiPage} from "../show-poi/show-poi";

/*
  Generated class for the EditImage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-edit-image',
  templateUrl: 'edit-image.html'
})
export class EditImagePage {

  poi:POI = new POI();

  constructor(public navCtrl: NavController,public navParams: NavParams, private tLogService: Tlog,
              private alertCtrl: AlertController, private security: Security,
              private loadingCtrl: LoadingController) {
    this.poi = this.navParams.get("poi");
  }

  ionViewDidLoad() {
  }

  filterGray = () => {
    this.tLogService.filterImage(this.poi._id, "gray");
    this.navCtrl.push(ShowPoiPage,{
      poi:this.poi
    })
  }

}

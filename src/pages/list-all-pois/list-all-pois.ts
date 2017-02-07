import { Component } from '@angular/core';
import {
  NavController, NavParams, AlertController, LoadingController, ActionSheetController,
  ActionSheet
} from 'ionic-angular';
import {LoginPage} from "../login/login";
import {POI} from "../../models/models";
import {Security} from "../../providers/security";
import {Tlog} from "../../providers/tlog";
import {ShowPoiPage} from "../show-poi/show-poi";

/*
  Generated class for the ListAllPois page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-list-all-pois',
  templateUrl: 'list-all-pois.html'
})
export class ListAllPoisPage {

  selectedItem: any;
  items: Array<POI>;
  poisSearched: Array<POI>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private tLogService: Tlog,
              private alertCtrl: AlertController, private security: Security,
              private loadingCtrl: LoadingController, private asCtrl: ActionSheetController) {

    this.selectedItem = navParams.get('item');
    this.items = [];
    this.poisSearched = [];
  }

  ionViewDidLoad() {
  }

  getSearchedPOIs(ev:any){
    this.poisSearched = this.items;
    let valueSearchbar = ev.target.value;
    if (valueSearchbar && valueSearchbar.trim() != '') {
      this.poisSearched = this.poisSearched.filter((items) => {
        return (items.name.toLowerCase().indexOf(valueSearchbar.toLocaleLowerCase()) > -1);
      })
    }
  }

  loadPOIs = () => {
    const loading = this.loadingCtrl.create({
      content: "Fetching POIs"
    });
    loading.present()
      .then(this.tLogService.getAllPois)
      .then(pois => this.items = pois).then(() => {
      this.poisSearched = this.items;
      loading.dismiss();
      console.log(this.items);
    })
      .catch(err => {
        loading.dismiss();
        this.showAlert("Error", `Could not retrieve list of trips: ${err.message || err}`);
      });
  };

  showAlert = (title: string, message: string) => this.alertCtrl.create({
    title: title,
    message: message,
    buttons: ['OK']
  }).present();

  ionViewWillEnter = () => {
    this.security.isNotloggedIn().then(exp => {
      if (exp) this.navCtrl.setRoot(LoginPage); else this.loadPOIs()
    });
  }

  showPoi = (poi) => this.navCtrl.push(ShowPoiPage,{
    poi:poi
  });

  itemTapped(event, poi) {
    this.presentPOIActionSheet(poi).present();
  }

  presentPOIActionSheet = (poi:POI):ActionSheet =>
    this.asCtrl.create({
      //title: 'Modify your album',
      buttons: [
        {
          text: 'Show Details',
          handler: () => {
            this.showPoi(poi);
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

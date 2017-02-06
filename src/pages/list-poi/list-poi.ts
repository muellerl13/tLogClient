import { Component } from '@angular/core';
import {
  NavController, NavParams, LoadingController, AlertController, ActionSheet, ActionSheetController
} from 'ionic-angular';
import {Tlog} from "../../providers/tlog";
import {POI} from "../../models/models";
import {LoginPage} from "../login/login";
import {Security} from "../../providers/security";
import {ShowPoiPage} from "../show-poi/show-poi";
import {AddPoiPage} from "../add-poi/add-poi";

/*
  Generated class for the ListPOI page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-list-poi',
  templateUrl: 'list-poi.html'
})
export class ListPOIPage {

  selectedItem: any;
  items: Array<POI>;
  poisSearched: Array<POI>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private tLogService: Tlog,
              private alertCtrl: AlertController, private security: Security,
              private loadingCtrl: LoadingController,private asCtrl: ActionSheetController) {

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
      content: "Fetching your POIs"
    });
    loading.present()
      .then(this.tLogService.getMyPois)
      .then(pois => this.items = pois).then(() => {
      loading.dismiss();
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
  };

  showPoi = (poi) => this.navCtrl.push(ShowPoiPage,{
    poi:poi
  });

  editPoi = (poi) => this.navCtrl.push(AddPoiPage,{
    poi:poi
  })

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
        },
        {
          text: 'Edit POI',
          handler: () => {
            this.editPoi(poi);
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

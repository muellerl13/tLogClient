import {Component} from '@angular/core';
import {NavController, AlertController, NavParams} from 'ionic-angular';
import {Camera, Transfer} from "ionic-native";
import {Serverconfig} from "../../providers/serverconfig";
import {Security} from "../../providers/security";

/*
 Generated class for the AddImage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-add-image',
  templateUrl: 'add-image.html'
})
export class AddImagePage {

  showAlert = (title: string, message: string) => this.alertCtrl.create({
    title: title,
    message: message,
    buttons: ['OK']
  }).present();


  upload = () => {
    this.security.getToken()
      .then(token =>
        new Transfer().upload(this.image,
          `${this.serverconfig.poiURI}/${this.navParams.get("poi")._id}/image`,
          {params: {description: "Sample Image"},headers: {authorization: `Bearer ${token}` } }))
      .then(() => this.navCtrl.pop())
      .catch(err => this.showAlert("ERROR", `Could not upload image (${err.body})`));
  }

  image: any;

  constructor(public navCtrl: NavController,
              private alertCtrl: AlertController,
              private navParams: NavParams,
              private security: Security,
              private  serverconfig: Serverconfig) {
  }

  takePhoto = () => Camera.getPicture({
    destinationType: Camera.DestinationType.FILE_URI
  }).then(imageURI => this.image = imageURI)
    .catch(err => this.showAlert("ERROR", `Could not take picture (${err})`));

  ionViewDidLoad() {
    console.log('Hello AddImagePage Page');
  }

}

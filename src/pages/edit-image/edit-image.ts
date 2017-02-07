import { Component } from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import {POI} from "../../models/models";
import {Tlog} from "../../providers/tlog";
import {Security} from "../../providers/security";
import {DomSanitizer} from "@angular/platform-browser";

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
              private loadingCtrl: LoadingController,  private sanitizer: DomSanitizer) {
    this.poi = this.navParams.get("poi");
  }

  ionViewDidLoad() {

  }

  getImages = () =>  Promise.all(this.poi.images.map((image) => this.tLogService.getImageURL(image.id)
    .then((url=>this.sanitizer.bypassSecurityTrustUrl(url)))))
    .then(urls => urls.forEach((url,i)=>this.poi.images[i].url=url));

  ngOnInit() {
    this.poi = this.navParams.get("poi");
    this.poi.images.forEach(img => img.uploaded = new Date(img.uploaded).toLocaleString());
    this.getImages();
  }

  showAlert = (title: string, message: string) => this.alertCtrl.create({
    title: title,
    message: message,
    buttons: ['OK']
  }).present();

  filterGray = (imageId) => {
    this.tLogService.filterImage(this.poi._id, "gray", imageId)
      .then((res) =>
        this.navCtrl.pop())
      .catch(err => this.showAlert("ERROR: Could not filter Image", err))
  };

  filterSepia = (imageId) => {
    this.tLogService.filterImage(this.poi._id, "sepia", imageId)
      .then((res) =>
        this.navCtrl.pop())
      .catch(err => this.showAlert("ERROR: Could not filter Image", err))
  };

  filterWarm = (imageId) => {
    this.tLogService.filterImage(this.poi._id, "warm", imageId)
      .then((res) =>
        this.navCtrl.pop())
      .catch(err => this.showAlert("ERROR: Could not filter Image", err))
  };

  filterCold = (imageId) => {
    this.tLogService.filterImage(this.poi._id, "cold", imageId)
      .then((res) =>
        this.navCtrl.pop())
      .catch(err => this.showAlert("ERROR: Could not filter Image", err))
  };

  deleteImage = (imageId:String) => {
    this.tLogService.deleteImage(imageId,this.poi).then((res) => this.navCtrl.pop())
  }

}

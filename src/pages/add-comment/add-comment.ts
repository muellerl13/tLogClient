import { Component } from '@angular/core';
import {NavController, AlertController, NavParams} from 'ionic-angular';
import {FormGroup, FormBuilder} from "@angular/forms";
import {Trip} from "../../models/models";
import {Tlog} from "../../providers/tlog";
import {Security} from "../../providers/security";
import {userInfo} from "os";

/*
  Generated class for the AddComment page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-comment',
  templateUrl: 'add-comment.html'
})
export class AddCommentPage {

  commentForm: FormGroup;
  content:string;
  userID:string;

  constructor(public navCtrl: NavController, private fb: FormBuilder, private tLogService: Tlog,
              private alertCtrl: AlertController,private navParams: NavParams, private security: Security) {}

  buildForm = (): void => {
    this.commentForm = this.fb.group({
      'content': ["",[]]
    });
  };

  showAlert = (title:string,message:string) => this.alertCtrl.create({title: title, message: message, buttons: ['OK']}).present();

  onSubmit = () => {console.log("Submitted TRIP Form!!")};

  ngOnInit(): void {
    this.buildForm();
  }

  save = () => {
    this.content = this.commentForm.get("content").value;
    this.security.getUser()
      .then(user => this.userID = user.id)
      .then(trip => this.tLogService.commentOnTrip(this.navParams.get("tripID"), this.userID, this.content))
      .then(() => this.navCtrl.pop())
      .catch((err) => {
      this.showAlert("Error",`Could not retrieve user: ${err._body}`)}
    );

  };

  ionViewDidLoad() {

  }

}

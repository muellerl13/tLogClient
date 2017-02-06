import { Component } from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {Serverconfig} from "../../providers/serverconfig";
import {Tlog} from "../../providers/tlog";
import {User} from "../../models/models";
import {Security} from "../../providers/security";

/*
  Generated class for the Userprofile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-userprofile',
  templateUrl: 'userprofile.html'
})
export class UserprofilePage {

  user: User = new User();
  registerForm: FormGroup;
  action: any;
  mode = "new";

  private EMAIL_REGEXP = "^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$";

  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              public serverconfig: Serverconfig,
              public tlog: Tlog,
              private security: Security,
              private alertCtrl:AlertController,
              private fb: FormBuilder,) {}


  ionViewDidLoad() {
    console.log('Entered User Profile Page');

    this.security.getUser()
      .then((rUser)=> {
        this.user = rUser
      })
      .catch((err) => {
        this.showAlert("Error",`Could not retrieve user: ${err._body}`)}
      );

  }

  onSubmit = () => {
    console.log("Submitted User Profile Form!")
  };

  buildForm(): void {
    this.registerForm = this.fb.group({
      'username': [this.user.username,[Validators.maxLength(16),Validators.minLength(3)]],
      'email': [this.user.email,[Validators.minLength(5),Validators.maxLength(256),Validators.pattern(this.EMAIL_REGEXP)]],
      'password': [this.user.password,[Validators.minLength(8),Validators.maxLength(128)]]
    });
  }

  showAlert = (title:string,message:string) =>
    this.alertCtrl.create({title: title, message:message})
      .present();

  ngOnInit() {

    this.buildForm();
    this.registerForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

  }

  validationMessages = {
    'username': {

      'minlength': "Your username has to have at least 3 characters",
      'maxlength': "Your username must not be longer than 16 characters"
    },
    'password': {

      'minlength': "Your password has to have at least 8 characters",
      'maxlength': "Your password must not be longer than 128 characters"
    },
    'email': {

      'minlength': "Your email has to have at least 5 characters",
      'maxlength': "Your email must not be longer than 256 characters",
      'pattern': "You have to enter a valid email"
    }
  };

  onValueChanged(data?: any){
    if (!this.registerForm) return;
    const form = this.registerForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'username':'',
    'password':'',
    'email':''
  };

  save = () => {

    console.log("In save function!");
    if(this.registerForm.value.username!=null&&this.registerForm.value.username!=undefined){
      this.user.username = this.registerForm.value.username;
    }
    if(this.registerForm.value.email!=null&&this.registerForm.value.username!=undefined){
      this.user.email = this.registerForm.value.email;
    }
    if(this.registerForm.value.password!=null&&this.registerForm.value.password!=undefined){
      this.user.password = this.registerForm.value.password;
    }
    this.mode = "edit";
    this.tlog.updateUser(this.user.id, this.user);
  }

}

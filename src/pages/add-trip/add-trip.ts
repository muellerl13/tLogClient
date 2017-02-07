import { Component } from '@angular/core';
import {NavController, AlertController, NavParams} from 'ionic-angular';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Trip} from "../../models/models";
import {Tlog} from "../../providers/tlog";

/*
  Generated class for the AddTrip page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-trip',
  templateUrl: 'add-trip.html'
})
export class AddTripPage {

  tripForm: FormGroup;
  trip:Trip = new Trip();
  mode = "new";
  action: any;

  constructor(public navCtrl: NavController, private fb: FormBuilder, private tLogService: Tlog, private alertCtrl: AlertController,private navParams: NavParams) {}

  buildForm = (): void => {
    console.log(this.trip)
    this.tripForm = this.fb.group({
      'name': [this.trip.name,[Validators.required,Validators.maxLength(100),Validators.minLength(3)]],
      'description': [this.trip.description,[Validators.maxLength(500)]],
      'begin': [this.trip.begin,[]],
      'end': [this.trip.end,[]]
    });
  };

  showAlert = (title:string,message:string) => this.alertCtrl.create({title: title, message: message, buttons: ['OK']}).present();

  validationMessages = {
    'name': {
      'required': 'You need to enter a name',
      'maxlength': "Must not exceed 100 characters",
      'minlength': "Mimimum length 3 characters"
    },
    'description': {
      'maxlength': "Must not exceed 500 characters"
    },
    'begin': {
    },
    'end': {}
  };

  onSubmit = () => {console.log("Submitted TRIP Form!!")};

  ngOnInit(): void {
    this.action = this.tLogService.addTrip;
    let trip = this.navParams.get("trip");
    console.log(trip)
    if (trip) {
      this.mode = "edit";
      this.tLogService.loadTrip(trip).then(trip => {this.trip = trip;
        this.tripForm.patchValue({name: this.trip.name, description: this.trip.description,
          begin: this.trip.begin, end: this.trip.end})});
      this.action = this.tLogService.updateTrip;
    };
    this.buildForm();
    this.tripForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
  }

  onValueChanged = (data?: any) => {
    if (!this.tripForm) return;
    const form = this.tripForm;
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
  };

  formErrors = {
    'name':'',
    'description':'',
    'begin':'',
    'end':''
  };

  save = () => {
    const trip = this.tripForm.value;
    trip._id = this.trip._id;
    this.action(trip)
      .then(
        trip => this.navCtrl.pop()
      )
      .catch(
        err => this.showAlert("ERROR",`${err.json().message}`)
      );
  };

  deleteTrip = ()  => {
    console.log("Deleting Trip");
    const trip = this.tripForm.value;
    trip._id = this.trip._id;
    this.tLogService.deleteTrip(trip)
      .then(deletedTrip => {
        this.showAlert("Delete",`${deletedTrip.name} was successfully deleted`);
        this.navCtrl.pop();
      })
      .catch(err => {
        this.showAlert("Error", `Could not delete Trip: ${err.json().message}`)
      })
  }

  ionViewDidLoad() {

  }

}

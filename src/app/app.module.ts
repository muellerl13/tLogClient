import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import {Security} from "../providers/security";
import {LoginPage} from "../pages/login/login";
import {ReactiveFormsModule} from "@angular/forms";
import {RegisterPage} from "../pages/register/register";
import {Storage} from '@ionic/storage';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Http } from '@angular/http';
import {Serverconfig} from "../providers/serverconfig";
import {Tlog} from "../providers/tlog";
import {AddTripPage} from "../pages/add-trip/add-trip";
import {TripPage} from "../pages/trip/trip";
import {TripGlobalPage} from "../pages/trip-global/trip-global";
import {AddPoiPage} from "../pages/add-poi/add-poi";
import {ShowPoiPage} from "../pages/show-poi/show-poi";
import {AddImagePage} from "../pages/add-image/add-image";
import {ListPOIPage} from "../pages/list-poi/list-poi";
import {ListAllPoisPage} from "../pages/list-all-pois/list-all-pois";
import {UserprofilePage} from "../pages/userprofile/userprofile";
import {ListAllTripsPage} from "../pages/list-all-trips/list-all-trips";
import {EditImagePage} from "../pages/edit-image/edit-image";
import {LogoutPage} from "../pages/logout/logout";
import {AddCommentPage} from "../pages/add-comment/add-comment";
import {ShowTripPage} from "../pages/show-trip/show-trip";



let storage = new Storage();

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    headerPrefix: '',
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => storage.get('id_token')),
  }), http);
}

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    LoginPage,
    LogoutPage,
    RegisterPage,
    AddTripPage,
    TripPage,
    TripGlobalPage,
    AddCommentPage,
    AddPoiPage,
    ShowPoiPage,
    ShowTripPage,
    AddImagePage,
    ListPOIPage,
    ListAllPoisPage,
    UserprofilePage,
    ListAllTripsPage,
    EditImagePage
  ],
  imports: [
    IonicModule.forRoot(MyApp), ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    LoginPage,
    LogoutPage,
    RegisterPage,
    AddTripPage,
    TripPage,
    TripGlobalPage,
    AddCommentPage,
    AddPoiPage,
    ShowPoiPage,
    ShowTripPage,
    AddImagePage,
    ListPOIPage,
    ListAllPoisPage,
    UserprofilePage,
    ListAllTripsPage,
    EditImagePage
  ],
  providers: [Security,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    },
    Serverconfig,
    Tlog
  ]
})
export class AppModule {}

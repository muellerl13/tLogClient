import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { StatusBar } from 'ionic-native';

import { ListPage } from '../pages/list/list';
import {ListPOIPage} from "../pages/list-poi/list-poi";
import {ListAllPoisPage} from "../pages/list-all-pois/list-all-pois";
import {UserprofilePage} from "../pages/userprofile/userprofile";
import {ListAllTripsPage} from "../pages/list-all-trips/list-all-trips";
import {LogoutPage} from "../pages/logout/logout";



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = ListPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'My Trips', component: ListPage },
      { title: 'All Trips', component: ListAllTripsPage },
      { title: 'My POIs', component: ListPOIPage },
      { title: 'All POIs', component: ListAllPoisPage },
      { title: 'User Profile', component: UserprofilePage},
      {title: 'Logout', component: LogoutPage}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }


  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}

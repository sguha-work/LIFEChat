import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import { HomePage } from '../home/home';
//import { ContactsPage } from '../contacts/contacts';
//import { PhotoPage } from '../photo/photo';

@Component({
  selector: 'page-tabs-controller',
  templateUrl: 'tabs-controller.html'
})
export class TabsControllerPage {

  // tab1Root: any = HomePage;
  // tab2Root: any = ContactsPage;
  // tab3Root: any = PhotoPage;
  constructor(public navCtrl: NavController) {
  }
  
}

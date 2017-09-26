import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule  } from 'angularfire2/database';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { File } from '@ionic-native/file';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Contacts} from '@ionic-native/contacts';
import { SocialSharing } from '@ionic-native/social-sharing';

import { HomePage } from '../pages/home/home';
import { ContactsPage } from '../pages/contacts/contacts';
import { PhotoPage } from '../pages/photo/photo';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { LoginPage } from '../pages/login/login';
import { JoinLIFEPage } from '../pages/join-life/join-life';
import { ConversationPage } from '../pages/conversation/conversation';
import { ImagePage } from '../pages/image/image';



import {FileService} from './../services/file.service';
import {Database} from './../services/database.service';
import {LoginService} from './../services/login.service';
import {CommonService} from './../services/common.service';
import {SignupService} from "./../services/signup.service";
import {AlertService} from "./../services/alert.service";
import {ContactService} from "./../services/contact.service";

export const firebaseConfig = {
  apiKey: "AIzaSyA9wyEcX_Qvceyzz6-a51Gd4TbGgZa5wfY",
  authDomain: "lifechat-909d7.firebaseapp.com",
  databaseURL: "https://lifechat-909d7.firebaseio.com",
  projectId: "lifechat-909d7",
  storageBucket: "lifechat-909d7.appspot.com",
  messagingSenderId: "580846990214"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ContactsPage,
    PhotoPage,
    TabsControllerPage,
    LoginPage,
    JoinLIFEPage,
    ConversationPage,
    ImagePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ContactsPage,
    PhotoPage,
    TabsControllerPage,
    LoginPage,
    JoinLIFEPage,
    ConversationPage,
    ImagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    UniqueDeviceID,
    AndroidPermissions,
    Contacts,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Database,
    FileService,
    LoginService,
    CommonService,
    SignupService,
    AlertService,
    ContactService
  ]
})
export class AppModule {}
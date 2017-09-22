import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { ContactsPage } from '../pages/contacts/contacts';
import { PhotoPage } from '../pages/photo/photo';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { LoginPage } from '../pages/login/login';
import { JoinLIFEPage } from '../pages/join-life/join-life';
import { ConversationPage } from '../pages/conversation/conversation';
import { ImagePage } from '../pages/image/image';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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
    IonicModule.forRoot(MyApp)
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
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
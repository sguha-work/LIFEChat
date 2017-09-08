import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HeadingPage } from './heading';

@NgModule({
  declarations: [
    HeadingPage,
  ],
  imports: [
    IonicPageModule.forChild(HeadingPage),
  ],
})
export class HeadingPageModule {}

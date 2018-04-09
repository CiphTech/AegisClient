import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { ConversationComponent } from './conversation/conversation.component';
import { DialogComponent } from './dialog/dialog.component';
import { CheckInComponent } from './check-in/check-in.component';

const appRoutes: Routes =[
    { path: 'checkin', component: CheckInComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    ConversationComponent,
    DialogComponent,
    CheckInComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

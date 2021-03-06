import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule  } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DialogComponent } from './dialog/dialog.component';
import { CheckInComponent } from './check-in/check-in.component';
import { MainPageComponent } from './main-page/main-page.component';
import { AuthService } from './services/auth.service';
import { DragAndDropDirective } from './directives/drag-and-drop.directive';
import { ConvAccessComponent } from './conv-access/conv-access.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material';

const appRoutes: Routes =[
    { path: '', component: MainPageComponent},
    { path: 'checkin', component: CheckInComponent},
    { path: 'convaccess/:accId', component: ConvAccessComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    CheckInComponent,
    MainPageComponent,
    DragAndDropDirective,
    ConvAccessComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserAnimationsModule,
    MaterialModule,    
    ReactiveFormsModule
  ],
  exports: [
      DragAndDropDirective
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

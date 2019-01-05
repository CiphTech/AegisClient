import {MatCheckboxModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import { NgModule } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatBadgeModule} from '@angular/material/badge';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatIconModule, MatMenuModule, MatToolbarModule, MatBadgeModule, 
  MatInputModule],
  exports: [MatButtonModule, MatCheckboxModule, MatIconModule, MatMenuModule, MatToolbarModule, MatBadgeModule, 
  MatInputModule],
})
export class MaterialModule { }
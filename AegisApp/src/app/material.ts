import {MatCheckboxModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import { NgModule } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatBadgeModule} from '@angular/material/badge';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';


@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatIconModule, MatMenuModule, MatToolbarModule, MatBadgeModule, 
  MatInputModule, MatCardModule, MatFormFieldModule,],
  exports: [MatButtonModule, MatCheckboxModule, MatIconModule, MatMenuModule, MatToolbarModule, MatBadgeModule, 
  MatInputModule, MatCardModule, MatFormFieldModule,],
})
export class MaterialModule { }
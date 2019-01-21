import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
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
import {MatChipsModule} from '@angular/material/chips';


@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatIconModule, MatMenuModule, MatToolbarModule, MatBadgeModule, 
  MatInputModule, MatCardModule, MatFormFieldModule, MatChipsModule],
  exports: [CdkTableModule, CdkTreeModule, DragDropModule, ScrollingModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatMenuModule, MatToolbarModule, MatBadgeModule, 
  MatInputModule, MatCardModule, MatFormFieldModule, MatChipsModule],
})
export class MaterialModule { }
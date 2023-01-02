import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesPageComponent } from './categories-page.component';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CategoriesService } from '../categories.service';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [
  {
    path: '',
    component: CategoriesPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesRouting {}

@NgModule({
  declarations: [CategoriesPageComponent],
  imports: [
    CommonModule,
    CategoriesRouting,
    FontAwesomeModule,
    DragDropModule,
    MatDialogModule,
    ToastrModule.forRoot(),
    FormsModule,
  ],
  exports: [CategoriesPageComponent],
  providers: [CategoriesService],
})
export class CategoriesPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesDialogComponent } from './categories-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CategoriesDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [CategoriesDialogComponent],
})
export class CategoriesDialogModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesPageModule } from './categories-page/categories-page.module';
import { CategoriesDialogModule } from './categories-dialog/categories-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    CategoriesPageModule,
    CategoriesDialogModule,
  ],
})
export class CategoriesModule {}

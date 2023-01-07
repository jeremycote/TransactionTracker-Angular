import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ChartsPageComponent } from './charts-page.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { CategoryChartsComponent } from './category-charts/category-charts.component';
import { PieChartsComponent } from './pie-charts/pie-charts.component';

export const routes: Routes = [
  {
    path: '',
    component: ChartsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartsRouting {}

@NgModule({
  declarations: [
    ChartsPageComponent,
    CategoryChartsComponent,
    PieChartsComponent,
  ],
  imports: [CommonModule, ChartsRouting, FormsModule, NgChartsModule],
  exports: [ChartsPageComponent],
})
export class ChartsPageModule {}

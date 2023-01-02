import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsPageComponent } from './charts-page.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

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
  declarations: [ChartsPageComponent],
  imports: [CommonModule, ChartsRouting, FormsModule, NgChartsModule],
  exports: [ChartsPageComponent],
})
export class ChartsPageModule {}

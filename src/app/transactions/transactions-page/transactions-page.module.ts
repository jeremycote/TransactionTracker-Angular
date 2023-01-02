import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../transactions.service';
import { TransactionsPageComponent } from './transactions-page.component';
import { MonthCardModule } from '../month-card/month-card.module';

export const routes: Routes = [
  {
    path: '',
    component: TransactionsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRouting {}

@NgModule({
  declarations: [TransactionsPageComponent],
  imports: [
    CommonModule,
    TransactionsRouting,
    FontAwesomeModule,
    MatDialogModule,
    ToastrModule.forRoot(),
    FormsModule,
    MonthCardModule,
  ],
  exports: [TransactionsPageComponent],
  providers: [TransactionService],
})
export class TransactionsPageModule {}

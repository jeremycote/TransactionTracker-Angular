import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsPageModule } from './transactions-page/transactions-page.module';
import { TransactionsDialogModule } from './transactions-dialog/transactions-dialog.module';
import { MonthCardModule } from './month-card/month-card.module';
import { TransactionsListDialogModule } from './transactions-list-dialog/transactions-list-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    TransactionsPageModule,
    TransactionsDialogModule,
    MonthCardModule,
    TransactionsListDialogModule,
  ],
})
export class TransactionsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsListDialogComponent } from './transactions-list-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { TransactionService } from '../transactions.service';

@NgModule({
  declarations: [TransactionsListDialogComponent],
  imports: [CommonModule, MatDialogModule, ToastrModule.forRoot()],
  exports: [TransactionsListDialogComponent],
  providers: [TransactionService],
})
export class TransactionsListDialogModule {}

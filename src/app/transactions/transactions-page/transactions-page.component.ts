import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import {
  QuickCreate,
  Transaction,
  TransactionService,
} from '../transactions.service';
import { TransactionsDialogComponent } from '../transactions-dialog/transactions-dialog.component';

@Component({
  selector: 'app-transactions-page',
  templateUrl: './transactions-page.component.html',
  styleUrls: ['./transactions-page.component.scss'],
})
export class TransactionsPageComponent {
  constructor(
    private transactionsService: TransactionService,
    private toastrService: ToastrService,
    public dialog: MatDialog
  ) {}

  years = Array.from(
    { length: new Date().getFullYear() - 2020 },
    (v, k) => k + 2021
  );
  year = new Date().getFullYear();

  launchNewTransactionDialog(quickCreate?: QuickCreate | null) {
    this.dialog.open(TransactionsDialogComponent, {
      width: '600px',
      data: {
        quickCreate: quickCreate,
      },
    });
  }

  launchEditDialog(transaction: Transaction) {
    this.dialog.open(TransactionsDialogComponent, {
      width: '600px',
      data: {
        edit: true,
        transaction: transaction,
      },
    });
  }

  deleteTransaction(id: number) {
    if (confirm('Are you sure you want to delete this Transaction?')) {
      lastValueFrom(this.transactionsService.deleteTransaction$(id)).then(
        (r) => {
          if (r) {
            this.toastrService.success(
              'The transaction has been successfully deleted',
              'Success'
            );
          } else {
            this.toastrService.error(
              'Something went wrong while deleting the Transaction',
              'Error'
            );
          }
        }
      );
    }
  }
}

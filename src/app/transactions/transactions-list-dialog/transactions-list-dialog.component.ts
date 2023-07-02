import { Component, Inject, OnInit, Optional } from '@angular/core';
import { Transaction, TransactionService } from '../transactions.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TransactionsDialogComponent } from '../transactions-dialog/transactions-dialog.component';
import { monthNames } from '../month-card/month-card.component';
import {
  CategoriesService,
  Category,
} from '../../categories/categories.service';
import { AuthService } from '../../components/shared/auth.service';
@Component({
  selector: 'app-transactions-list-dialog',
  templateUrl: './transactions-list-dialog.component.html',
  styleUrls: ['./transactions-list-dialog.component.scss'],
})
export class TransactionsListDialogComponent {
  transactions: Transaction[];
  year: number | null = null;
  month: number | null = null;
  monthNames = monthNames;
  categories$ = this.categoriesService.fetchCategories$();
  constructor(
    public authService: AuthService,
    private dialog: MatDialog,
    private transactionService: TransactionService,
    private categoriesService: CategoriesService,
    private toastrService: ToastrService,
    private dialogRef: MatDialogRef<TransactionsDialogComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: {
      month?: number;
      year: number;
      transactions: Transaction[];
    }
  ) {
    this.year = data?.year;
    this.month = data?.month ?? null;
    this.transactions = data?.transactions;
  }

  getCategoryNameById(category_id: number, categoriesList: Category[]) {
    return categoriesList.find((c) => c.id === category_id)?.name ?? 'N/A';
  }

  deleteTransaction(id: number) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.dialogRef.close();
      lastValueFrom(this.transactionService.deleteTransaction$(id)).then(
        (r) => {
          if (r) {
            this.toastrService.success(
              'Transaction deleted successfully',
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

  launchEditDialog(transaction: Transaction) {
    this.dialogRef.close();
    this.dialog.open(TransactionsDialogComponent, {
      width: '600px',
      data: {
        edit: true,
        transaction: transaction,
      },
    });
  }
}

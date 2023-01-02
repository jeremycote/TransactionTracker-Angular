import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  MonthlyTransactions,
  QuickCreate,
  Transaction,
  TransactionService,
} from '../transactions.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TransactionsDialogComponent } from '../transactions-dialog/transactions-dialog.component';
import { TransactionsListDialogComponent } from '../transactions-list-dialog/transactions-list-dialog.component';
import { MatDialog } from '@angular/material/dialog';

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

@Component({
  selector: 'app-month-card',
  templateUrl: './month-card.component.html',
  styleUrls: ['./month-card.component.scss'],
})
export class MonthCardComponent implements OnInit {
  @Input() month: number | null = null;
  @Input()
  set year(value: number) {
    this.year$.next(value);
  }
  @Output() createTransaction = new EventEmitter<QuickCreate | null>();
  monthlyTransactions$: Observable<MonthlyTransactions> | undefined;
  year$ = new BehaviorSubject(new Date().getFullYear());
  monthNames = monthNames;
  isDropdownOpen = false;

  faPlus = faPlus;
  faEye = faEye;
  constructor(
    private transactionsService: TransactionService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.year$
      .pipe(
        tap(
          (year) =>
            (this.monthlyTransactions$ =
              this.transactionsService.fetchMonthlyTransactions$(
                this.month,
                year
              ))
        )
      )
      .subscribe();
  }

  createNewTransaction(quickCreate?: QuickCreate | null) {
    this.isDropdownOpen = false;
    this.createTransaction.emit(quickCreate);
  }

  launchTransactionListDialog(
    transactions: Transaction[],
    year: number,
    month: number | null
  ) {
    this.dialog.open(TransactionsListDialogComponent, {
      width: '800px',
      data: {
        transactions: transactions,
        year: year,
        month: month,
      },
    });
  }
}

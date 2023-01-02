import { Component, Inject, Optional } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import {
  QuickCreate,
  Transaction,
  TransactionService,
} from '../transactions.service';
import { CategoriesService } from '../../categories/categories.service';
import { formatDate } from '@angular/common';
import { CurrencyConverterService } from '../../components/shared/currency-converter.service';
import { AuthService } from '../../components/shared/auth.service';

@Component({
  selector: 'app-transactions-dialog',
  templateUrl: './transactions-dialog.component.html',
  styleUrls: ['./transactions-dialog.component.scss'],
})
export class TransactionsDialogComponent {
  isFormSubmitted = false;
  form: FormGroup;
  edit: boolean = false;
  transaction: Transaction;
  quickCreate: QuickCreate | null = null;
  categories$ = this.categoriesService.fetchCategories$();

  constructor(
    private fb: FormBuilder,
    private transactionsService: TransactionService,
    public dialogRef: MatDialogRef<TransactionsDialogComponent>,
    public categoriesService: CategoriesService,
    private toastrService: ToastrService,
    private currencyService: CurrencyConverterService,
    public authService: AuthService,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: {
      edit: boolean;
      transaction: Transaction;
      quickCreate: QuickCreate | null;
    }
  ) {
    this.edit = data?.edit;
    this.transaction = data?.transaction;
    this.quickCreate = data?.quickCreate;

    this.form = this.fb.group({
      name: new FormControl(
        this.transaction?.name ?? this.quickCreate?.name ?? '',
        Validators.required
      ),
      category_id: new FormControl(
        this.transaction?.category_id ?? this.quickCreate?.category_id ?? '',
        Validators.required
      ),
      date: new FormControl(
        this.transaction?.date ??
          (this.quickCreate
            ? formatDate(new Date(), 'yyyy-MM-dd', 'en_US')
            : ''),
        Validators.required
      ),
      original_price: new FormControl(
        this.transaction?.original_price ??
          this.quickCreate?.original_price ??
          0,
        Validators.required
      ),
      original_currency: new FormControl(
        this.transaction?.original_currency ??
          this.quickCreate?.original_currency ??
          0,
        Validators.required
      ),
      final_price: new FormControl(
        this.transaction?.final_price ?? 0,
        Validators.required
      ),
      final_currency: new FormControl(
        this.transaction?.final_currency ??
          this.authService.currentUser?.default_currency ??
          'CAD',
        Validators.required
      ),
      ignore_from_calculations: new FormControl(
        this.transaction?.ignore_from_calculations ?? false,
        Validators.required
      ),
    });

    if (
      this.quickCreate?.original_price &&
      this.quickCreate?.original_currency
    ) {
      this.currencyService
        .convertCurrency(
          this.quickCreate.original_price,
          this.quickCreate.original_currency
        )
        .then((value) => this.form.controls['final_price'].setValue(value));
    }
  }

  async saveTransaction() {
    this.isFormSubmitted = true;
    if (this.form.valid) {
      if (this.edit) {
        await lastValueFrom(
          this.transactionsService.updateTransaction$(
            this.transaction.id,
            this.form.value
          )
        ).then((r) => {
          if (r) {
            this.dialogRef.close();
            this.toastrService.success('Transaction updated successfully');
          } else {
            this.toastrService.error(
              'An error occurred while updating the transaction'
            );
          }
        });
      } else {
        await lastValueFrom(
          this.transactionsService.createTransaction$(this.form.value)
        ).then((r) => {
          if (r) {
            this.dialogRef.close();
            this.toastrService.success('Transaction created successfully');
          } else {
            this.toastrService.error(
              'An error occurred while creating a transaction'
            );
          }
        });
      }
    }
  }

  setDateToday() {
    this.form.controls['date'].setValue(
      formatDate(new Date(), 'yyyy-MM-dd', 'en_US')
    );
  }

  async updateFinalPrice() {
    this.form.controls['final_price'].setValue(
      await this.currencyService.convertCurrency(
        this.form.controls['original_price'].value,
        this.form.controls['original_currency'].value
      )
    );
  }
}

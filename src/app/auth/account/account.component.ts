import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../components/shared/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TransactionService } from '../../transactions/transactions.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  updateNameForm: FormGroup;
  isNameFormSubmitted = false;
  updatePasswordForm: FormGroup;
  isPasswordFormSubmitted = false;
  importTransactionsForm: FormGroup;
  isImportTransactionsFormSubmitted = false;
  csvFile: File | null = null;

  constructor(
    public authService: AuthService,
    private toastr: ToastrService,
    private transactionsService: TransactionService
  ) {
    this.updateNameForm = new FormGroup({
      name: new FormControl(this.authService.currentUser?.name ?? '', [
        Validators.required,
      ]),
    });

    this.updatePasswordForm = new FormGroup({
      current_password: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      password_confirmation: new FormControl('', [Validators.required]),
    });

    this.importTransactionsForm = new FormGroup({
      csv_file: new FormControl(null, [Validators.required]),
    });
  }

  submitNameForm() {
    this.isNameFormSubmitted = true;
    if (this.updateNameForm.valid) {
      this.authService
        .accountUpdateName(this.updateNameForm.get('name')?.value)
        .subscribe(
          async (res) => {
            this.toastr.success('Your profile has been updated!');
            this.isNameFormSubmitted = false;
            this.updateNameForm.reset();
          },
          () =>
            this.toastr.error(
              'An error occurred while updating your profile... Please try again.'
            )
        );
    } else {
      this.toastr.error(
        'An error occurred while updating your profile... Please try again.'
      );
    }
  }
  submitPasswordForm() {
    this.isPasswordFormSubmitted = true;
    if (this.updatePasswordForm.valid) {
      this.authService
        .accountUpdatePassword(this.updatePasswordForm.value)
        .subscribe(
          async (res) => {
            this.toastr.success('Your profile has been updated!');
            this.isPasswordFormSubmitted = false;
            this.updatePasswordForm.reset();
          },
          () =>
            this.toastr.error(
              'An error occurred while updating your profile... Please try again.'
            )
        );
    } else {
      this.toastr.error(
        'An error occurred while updating your profile... Please try again.'
      );
    }
  }

  uploadFile(event: any) {
    this.csvFile = event.target.files[0] ?? null;
  }

  submitImportTransactionsForm() {
    this.isImportTransactionsFormSubmitted = true;
    if (this.importTransactionsForm.valid && this.csvFile) {
      this.transactionsService.importTransactions$(this.csvFile).subscribe(
        async (res) => {
          this.toastr.success('All transactions have been imported!');
          this.isImportTransactionsFormSubmitted = false;
          this.importTransactionsForm.reset();
        },
        () =>
          this.toastr.error(
            'An error occurred while importing the transactions... Please try again.'
          )
      );
    } else {
      this.toastr.error(
        'An error occurred while importing the transactions... Please try again.'
      );
    }
  }
}

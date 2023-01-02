import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../components/shared/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  error = false;

  constructor(
    public authService: AuthService,
    public router: Router,
    private toastr: ToastrService
  ) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }

    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  forgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.authService
        .forgotPassword(this.forgotPasswordForm.get('email')?.value)
        .subscribe(
          async (res) => {
            this.toastr.success(
              'You successfully requested a password reset! Please follow the link in your inbox to reset your password.'
            );
            await this.router.navigate(['/']);
          },
          () => (this.error = true)
        );
    } else {
      this.error = true;
    }
  }
}

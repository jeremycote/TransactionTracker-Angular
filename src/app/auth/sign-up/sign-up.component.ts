import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../components/shared/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  signupForm: FormGroup;
  error: Record<string, string[]> = {};

  constructor(
    public authService: AuthService,
    public router: Router,
    private toastr: ToastrService
  ) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }

    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      password_confirmation: new FormControl('', [Validators.required]),
      default_currency: new FormControl('CAD', [Validators.required]),
    });
  }

  signupUser() {
    if (this.signupForm.valid) {
      this.authService.signUp(this.signupForm.value).subscribe(
        async (res) => {
          this.error = {};
          await this.router.navigate(['/']);
          this.toastr.success(
            'You successfully signed-up! Please follow the link in your inbox to confirm your account.'
          );
        },
        (err) => {
          this.error = err.error.errors;
        }
      );
    } else {
      this.error = {};
      Object.keys(this.signupForm.value).map((v) => {
        if (this.signupForm.get(v)?.errors) {
          this.error[v] = ['is required.'];
        }
      });
    }
  }
}

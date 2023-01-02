import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, AuthTokens } from '../../components/shared/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  error = false;
  filters: AuthTokens | null = null;
  submitted = false;

  constructor(
    public authService: AuthService,
    public router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }

    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      password_confirmation: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.filters = {
        accessToken: params.get('access-token')!,
        uid: params.get('uid')!,
        client: params.get('client')!,
      };
    });
  }

  resetPassword() {
    this.submitted = true;

    if (this.resetPasswordForm.valid && this.filters) {
      this.authService
        .resetPassword(this.resetPasswordForm.value, this.filters)
        .subscribe(async () => {
          this.toastr.success(
            'You successfully completed your password reset! You can now sign-in!'
          );
          await this.router.navigate(['/', 'auth', 'login']);
        });
    } else {
      this.error = true;
    }
  }
}

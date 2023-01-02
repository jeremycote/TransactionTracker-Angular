import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../components/shared/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  signinForm: FormGroup;
  error = false;
  submitted = false;

  constructor(public authService: AuthService, public router: Router) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }

    this.signinForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  loginUser() {
    this.submitted = true;
    if (this.signinForm.valid) {
      this.authService.signIn(this.signinForm.value).subscribe(
        async (res) => {
          if (res.headers.get('access-token') && res.body.data) {
            await this.authService.saveCredentials(res);
            this.error = false;
          } else {
            this.error = true;
          }
        },
        () => (this.error = true)
      );
    }
  }
}

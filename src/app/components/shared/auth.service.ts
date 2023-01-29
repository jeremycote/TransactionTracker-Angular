import { Injectable } from '@angular/core';
import { RegisterUser, User } from './user';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import config from '../../../envVariables';

interface ResetPasswordInterface {
  password: string;
  password_confirmation: string;
}

interface UpdatePasswordInterface extends ResetPasswordInterface {
  current_password: string;
}

export interface AuthTokens {
  accessToken: string;
  client: string;
  uid: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint: string = `${config.API_URL}/auth`;

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser: User | null = null;
  constructor(private http: HttpClient, public router: Router) {}

  signUp(user: RegisterUser) {
    return this.http.post<any>(`${this.endpoint}/`, user);
  }

  // Sign-in
  signIn(user: User) {
    return this.http.post<any>(
      `${this.endpoint}/sign_in`,
      {
        email: user.email,
        password: user.password,
      },
      { observe: 'response' }
    );
  }

  // Validate Tokens
  validateTokens() {
    return this.http
      .get<any>(`${this.endpoint}/validate_token`)
      .pipe(tap((res) => (this.currentUser = res.data)));
  }

  // Clear User
  clearUser() {
    localStorage.removeItem('access-token');
    localStorage.removeItem('client');
    localStorage.removeItem('uid');
  }

  // Account Update
  accountUpdateName(name: string) {
    return this.http.put<any>(
      `${this.endpoint}/`,
      {
        name,
      },
      { observe: 'response' }
    );
  }
  accountUpdatePassword(passwordObj: UpdatePasswordInterface) {
    return this.http.put<any>(`${this.endpoint}`, passwordObj, {
      observe: 'response',
    });
  }

  // Forgot Password
  forgotPassword(email: string) {
    return this.http.post<any>(
      `${this.endpoint}/password`,
      {
        email,
        redirect_url: 'http://localhost:4200/auth/reset-password',
      },
      { observe: 'response' }
    );
  }

  // Reset Password
  resetPassword(passwordObj: ResetPasswordInterface, authTokens: AuthTokens) {
    const headers = {
      'access-token': authTokens.accessToken,
      client: authTokens.client,
      uid: authTokens.uid,
    };

    return this.http.put<any>(
      `${this.endpoint}/password`,
      {
        password: passwordObj.password,
        password_confirmation: passwordObj.password_confirmation,
      },
      { observe: 'response', headers }
    );
  }

  // Save Credentials and go to Profile
  async saveCredentials(res: any) {
    localStorage.setItem('access-token', res.headers.get('access-token'));
    localStorage.setItem('client', res.headers.get('client'));
    localStorage.setItem('uid', res.headers.get('uid'));
    this.currentUser = res.body.data;
    await this.router.navigate(['transactions']);
  }

  getTokens() {
    return {
      accessToken: localStorage.getItem('access-token') ?? '',
      client: localStorage.getItem('client') ?? '',
      uid: localStorage.getItem('uid') ?? '',
    };
  }

  get isLoggedIn(): boolean {
    return !!(
      localStorage.getItem('access-token') &&
      localStorage.getItem('client') &&
      localStorage.getItem('uid')
    );
  }

  signOut() {
    return this.http
      .delete<any>(`${this.endpoint}/sign_out`, {})
      .pipe(catchError(this.handleError))
      .subscribe(
        async () => {
          this.clearUser();
          await this.router.navigate(['signin']);
        },
        async () => {
          this.clearUser();
          await this.router.navigate(['signin']);
        }
      );
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { AuthService } from './auth.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (
      this.authService.isLoggedIn &&
      !req.url.includes('api.exchangerate.host')
    ) {
      const authTokens = this.authService.getTokens();

      req = req.clone({
        setHeaders: {
          'access-token': authTokens.accessToken,
          client: authTokens.client,
          uid: authTokens.uid,
        },
      });
    }
    return next.handle(req);
  }
}

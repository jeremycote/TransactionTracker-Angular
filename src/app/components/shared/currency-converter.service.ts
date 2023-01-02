import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { lastValueFrom } from 'rxjs';
import { map, tap } from 'rxjs/operators';

const API_URL = 'https://api.exchangerate.host';

@Injectable({
  providedIn: 'root',
})
export class CurrencyConverterService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  async convertCurrency(initialValue: number, initialCurrency: string) {
    return await lastValueFrom(
      this.http
        .get(
          `${API_URL}/convert?from=${initialCurrency}&to=${this.authService.currentUser?.default_currency}&amount=${initialValue}`
        )
        .pipe(map((res: any) => res.result))
    );
  }
}

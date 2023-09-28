import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { evaluate } from 'mathjs';

const API_URL = 'https://api.exchangerate.host';

@Injectable({
  providedIn: 'root',
})
export class CurrencyConverterService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  async convertCurrency(
    sameCurrency: boolean,
    initialValue: number | string,
    initialCurrency: string,
    date?: string
  ): Promise<any | null> {
    const finalDate =
      !date || new Date(Date.parse(date)) > new Date()
        ? formatDate(new Date(), 'yyyy-MM-dd', 'en_US')
        : date;

    try {
      const value = evaluate(String(initialValue));
      return sameCurrency
        ? value
        : await lastValueFrom(
            this.http
              .get(
                `${API_URL}/convert?from=${initialCurrency}&to=${this.authService.currentUser?.default_currency}&amount=${value}&date=${finalDate}&access_key=3c0c87e6773f791673b5c66e04761f6f`
              )
              .pipe(map((res: any) => res.result))
          );
    } catch {
      return null;
    }
  }
}

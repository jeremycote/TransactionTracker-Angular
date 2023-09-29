import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { evaluate } from 'mathjs';

const API_URL = 'https://api.freecurrencyapi.com/v1/';

@Injectable({
  providedIn: 'root',
})
export class CurrencyConverterService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private returnEndpoint(date: string): string {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);
    if (new Date(date) >= currentDate) {
      return 'latest';
    } else {
      return 'historical';
    }
  }

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

    const finalCurrency = this.authService.currentUser?.default_currency;
    if (!finalCurrency) {
      return null;
    }

    try {
      const value = evaluate(String(initialValue));
      return sameCurrency
        ? value
        : await lastValueFrom(
            this.http
              .get(
                `${API_URL}/${this.returnEndpoint(
                  finalDate
                )}?base_currency=${initialCurrency}&currencies=${finalCurrency}&date=${finalDate}&apikey=fca_live_ssUFBdQaPVdG0QzwykRXgdyJyILTC1iQv6q5QPNp`
              )
              .pipe(
                map(
                  (res: any) =>
                    (this.returnEndpoint(finalDate) === 'historical'
                      ? res.data[finalDate][finalCurrency]
                      : res.data[finalCurrency]) * value
                )
              )
          );
    } catch {
      return null;
    }
  }
}

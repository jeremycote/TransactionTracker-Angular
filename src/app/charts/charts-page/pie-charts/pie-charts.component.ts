import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, Observable } from 'rxjs';
import { ChartConfiguration, ChartData, DefaultDataPoint } from 'chart.js';
import { TransactionService } from '../../../transactions/transactions.service';
import { monthNames } from 'src/app/transactions/month-card/month-card.component';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-pie-charts',
  templateUrl: './pie-charts.component.html',
  styleUrls: ['./pie-charts.component.scss'],
})
export class PieChartsComponent {
  monthNames = monthNames;
  years = Array.from(
    { length: new Date().getFullYear() - 2020 },
    (v, k) => k + 2021
  );
  set year(value: number) {
    this.year$.next(value);
  }
  get year() {
    return this.year$.getValue();
  }
  year$ = new BehaviorSubject(new Date().getFullYear());

  months = Array.from({ length: 12 }, (v, k) => k + 1);

  set month(value: number) {
    this.month$.next(value);
  }
  get month() {
    return this.month$.getValue();
  }
  month$ = new BehaviorSubject(new Date().getMonth() + 1);

  pieChartData$: Observable<ChartConfiguration<'pie'>['data']> | undefined;

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  constructor(private transactionsService: TransactionService) {}

  ngOnInit(): void {
    combineLatest([this.month$, this.year$])
      .pipe(
        tap(
          ([month, year]) =>
            (this.pieChartData$ = this.transactionsService
              .fetchMonthlyTransactions$(month, year)
              .pipe(
                map((data) =>
                  data.sum_per_category.filter((c) => Number(c.sum) !== 0)
                ),
                map((data) => ({
                  datasets: [
                    {
                      data: data.map((c) => c.sum),
                    },
                  ],
                  labels: data.map((c) => c.category_name),
                }))
              ))
        )
      )
      .subscribe();
  }

  containsAll(
    pieChartData: ChartData<'pie', DefaultDataPoint<'pie'>, unknown>
  ) {
    return pieChartData.datasets[0].data.every((v) => Number(v) === 0);
  }
}

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { ChartConfiguration } from 'chart.js';
import { TransactionService } from '../../../transactions/transactions.service';
import { AuthService } from '../../../components/shared/auth.service';
import { CategoriesService } from '../../../categories/categories.service';
import { map, tap } from 'rxjs/operators';
import { monthNames } from '../../../transactions/month-card/month-card.component';

@Component({
  selector: 'app-category-charts',
  templateUrl: './category-charts.component.html',
  styleUrls: ['./category-charts.component.scss'],
})
export class CategoryChartsComponent implements OnInit {
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
  categories$ = this.categoriesService.fetchCategories$();
  set category(value: number) {
    this.category$.next(value);
  }
  get category() {
    return this.category$.getValue();
  }
  category$ = new BehaviorSubject<number>(0);
  lineChartData$: Observable<ChartConfiguration<'line'>['data']> | undefined;

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    maintainAspectRatio: false,
    responsive: true,
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        min: 0,
        title: {
          display: true,
          text: `Amount (${
            this.authService.currentUser?.default_currency ?? 'CAD'
          })`,
        },
      },
    },
  };
  constructor(
    private transactionsService: TransactionService,
    private authService: AuthService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    combineLatest([this.year$, this.category$])
      .pipe(
        tap(
          ([year, category]) =>
            (this.lineChartData$ = this.transactionsService
              .fetchChartsDatasets$(year, category)
              .pipe(
                map((data) => ({
                  datasets: data,
                  labels: monthNames,
                }))
              ))
        )
      )
      .subscribe();
  }
}

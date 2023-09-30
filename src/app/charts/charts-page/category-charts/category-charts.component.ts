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
  set categoryList(value: number[]) {
    this.categoryList$.next(value);
  }
  get categoryList(): number[] {
    return this.categoryList$.getValue();
  }
  categoryList$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([0]);

  categories$ = this.categoriesService.fetchCategories$();
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
    combineLatest([this.year$, this.categoryList$])
      .pipe(
        tap(
          ([year, categories]) =>
            (this.lineChartData$ = this.transactionsService
              .fetchChartsDatasets$(year, categories)
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

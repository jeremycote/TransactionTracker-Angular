import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import config from '../../envVariables';

const API_URL = `${config.API_URL}/categories`;

enum IncomeCategoryType {
  income = 'income',
  expense = 'expense',
  neutral = 'neutral',
}

export interface Category {
  id: number;
  user_id: number;
  name: string;
  income: IncomeCategoryType;
  order: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private categoriesToUpdate = new Subject<number | null>();

  constructor(private http: HttpClient) {}

  fetchCategories$(): Observable<Category[]> {
    return this.categoriesToUpdate.pipe(
      startWith(null as unknown),
      switchMap(() => {
        return this.http.get<Category[]>(API_URL).pipe(map((res) => res));
      })
    );
  }

  mergeCategory$(id: number, newCategoryId: number): Observable<number> {
    return this.http
      .post<number>(`${API_URL}/${id}/merge`, {
        new_category_id: newCategoryId,
      })
      .pipe(
        tap(() => this.categoriesToUpdate.next(newCategoryId)),
        map((res) => res)
      );
  }

  reorderCategories$(categoryIds: number[]): Observable<number> {
    return this.http
      .post<number>(`${API_URL}/reorder`, {
        category_ids: categoryIds,
      })
      .pipe(
        tap(() => this.categoriesToUpdate.next(null)),
        map((res) => res)
      );
  }

  updateCategory$(id: number, category: Category): Observable<number> {
    return this.http.put<number>(`${API_URL}/${id}`, category).pipe(
      tap(() => this.categoriesToUpdate.next(id)),
      map((res) => res)
    );
  }

  createCategory$(category: Category): Observable<number> {
    return this.http.post<number>(API_URL, category).pipe(
      tap(() => this.categoriesToUpdate.next(null)),
      map((res) => res)
    );
  }

  deleteCategory$(category_id: number): Observable<number> {
    return this.http.delete<number>(`${API_URL}/${category_id}`).pipe(
      tap(() => this.categoriesToUpdate.next(null)),
      map((res) => res)
    );
  }
}

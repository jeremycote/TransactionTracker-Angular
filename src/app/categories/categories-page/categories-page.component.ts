import { Component } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { CategoriesService, Category } from '../categories.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesDialogComponent } from '../categories-dialog/categories-dialog.component';
import { lastValueFrom } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss'],
})
export class CategoriesPageComponent {
  constructor(
    private categoriesService: CategoriesService,
    private toastrService: ToastrService,
    public dialog: MatDialog
  ) {}
  categories$ = this.categoriesService.fetchCategories$();
  faBars = faBars;
  mergeCategoryId: number | null = null;
  newCategoryId: number | null = null;

  launchNewCategoryDialog() {
    this.dialog.open(CategoriesDialogComponent, {
      width: '600px',
    });
  }

  launchEditDialog(category: Category) {
    this.dialog.open(CategoriesDialogComponent, {
      width: '600px',
      data: {
        edit: true,
        category: category,
      },
    });
  }

  mergeCategory() {
    if (
      this.mergeCategoryId &&
      this.newCategoryId &&
      confirm('Are you sure you want to merge this category?')
    ) {
      lastValueFrom(
        this.categoriesService.mergeCategory$(
          this.mergeCategoryId,
          this.newCategoryId
        )
      ).then((r) => {
        if (r) {
          this.mergeCategoryId = null;
          this.newCategoryId = null;
          this.toastrService.success('Category merged successfully', 'Success');
        } else {
          this.toastrService.error(
            'Something went wrong while merging the Category',
            'Error'
          );
        }
      });
    }
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      lastValueFrom(this.categoriesService.deleteCategory$(id)).then((r) => {
        if (r) {
          this.toastrService.success(
            'Category deleted successfully',
            'Success'
          );
        } else {
          this.toastrService.error(
            'Something went wrong while deleting the Category',
            'Error'
          );
        }
      });
    }
  }

  async reorder(event: CdkDragDrop<Category[]>) {
    await moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    await lastValueFrom(
      this.categoriesService.reorderCategories$(
        await lastValueFrom(
          this.categories$.pipe(map((v) => v.map((c) => c.id)))
        )
      )
    ).then((r) => {
      if (!r) {
        this.toastrService.error(
          'Something went wrong while reordering the Category',
          'Error'
        );
      }
    });
  }
}

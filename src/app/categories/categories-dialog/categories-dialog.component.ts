import { Component, Inject, Optional } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CategoriesService, Category } from '../categories.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-categories-dialog',
  templateUrl: './categories-dialog.component.html',
  styleUrls: ['./categories-dialog.component.scss'],
})
export class CategoriesDialogComponent {
  isFormSubmitted = false;
  form: FormGroup;
  edit: boolean = false;
  category: Category;

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    public dialogRef: MatDialogRef<CategoriesDialogComponent>,
    private toastrService: ToastrService,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: {
      edit: boolean;
      category: Category;
    }
  ) {
    this.edit = data?.edit;
    this.category = data?.category;

    this.form = this.fb.group({
      name: new FormControl(this.category?.name ?? '', Validators.required),
      income: new FormControl(this.category?.income ?? '', Validators.required),
    });
  }

  async saveCategory() {
    this.isFormSubmitted = true;
    if (this.form.valid) {
      if (this.edit) {
        await lastValueFrom(
          this.categoriesService.updateCategory$(
            this.category.id,
            this.form.value
          )
        ).then((r) => {
          if (r) {
            this.dialogRef.close();
            this.toastrService.success('Category updated successfully');
          } else {
            this.toastrService.error(
              'An error occurred while updating a category'
            );
          }
        });
      } else {
        await lastValueFrom(
          this.categoriesService.createCategory$(this.form.value)
        ).then((r) => {
          if (r) {
            this.dialogRef.close();
            this.toastrService.success('Category created successfully');
          } else {
            this.toastrService.error(
              'An error occurred while creating a category'
            );
          }
        });
      }
    }
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsListDialogComponent } from './transactions-list-dialog.component';

describe('TransactionsListDialogComponent', () => {
  let component: TransactionsListDialogComponent;
  let fixture: ComponentFixture<TransactionsListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionsListDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

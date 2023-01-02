import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthCardComponent } from './month-card.component';
import { TransactionService } from '../transactions.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [MonthCardComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [MonthCardComponent],
  providers: [TransactionService],
})
export class MonthCardModule {}

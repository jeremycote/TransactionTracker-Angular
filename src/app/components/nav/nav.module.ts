import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@NgModule({
  declarations: [NavComponent],
  imports: [CommonModule, RouterLink, RouterLinkActive],
  exports: [NavComponent],
})
export class NavModule {}

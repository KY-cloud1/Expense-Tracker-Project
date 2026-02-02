import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe, DatePipe, NgOptimizedImage } from '@angular/common';
import { UserSpendingDataService } from '../../services/user-spending-data';
import { UserSpending } from '../../models/user-spending';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, NgOptimizedImage, ReactiveFormsModule],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboardComponent implements OnInit {

  userSpending?: UserSpending;
  today: Date = new Date();

  miscValueControl = new FormControl(null)

  constructor(
    private userSpendingDataService: UserSpendingDataService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.userSpendingDataService.getUserSpendingSummary().subscribe({
      next: data => {
        this.userSpending = data;
        this.cdr.detectChanges();  // Force template to update.
      },
      error: err => console.error('Error user-dashboard component init:', err)
    });
  }

  handleMiscSpendCancel(): void {
    this.miscValueControl.reset();
    return;
  }

  handleMiscSpendSubmit(): void {
    if (!this.userSpending) return;

    const miscUpdateDelta = Number(this.miscValueControl.value);
    if (isNaN(miscUpdateDelta)) {
      this.miscValueControl.reset();
      return;
    }

    const updatedMiscSpending =
      this.userSpending.misc_spending_month + miscUpdateDelta;

    this.userSpendingDataService.updateMiscSpending(updatedMiscSpending)
      .subscribe({
        next: updatedValue => {
          this.userSpending = updatedValue;
          this.miscValueControl.reset();
        },
        error: err => {
          console.error('handleMiscSubmit failed', err)
        }
      })
  }

  get miscSpendingDisplay(): number {
    if (!this.userSpending) return 0;

    const miscDelta = Number(this.miscValueControl.value ?? 0)
    return this.userSpending.misc_spending_month + miscDelta;
  }
}

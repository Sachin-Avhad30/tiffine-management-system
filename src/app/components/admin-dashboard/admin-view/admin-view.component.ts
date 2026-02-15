import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { RejectedAdminViewComponent } from '../rejected-admin-view/rejected-admin-view.component';
import { PendingAdminViewComponent } from '../pending-admin-view/pending-admin-view.component';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { InfoChartsComponent } from '../../info-charts/info-charts.component';
import { AdminApprovalRightsService } from '../../../services/admin-approval-rights.service';
import { NgApexchartsModule } from 'ng-apexcharts';


@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [
    RejectedAdminViewComponent,
    PendingAdminViewComponent,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    InfoChartsComponent,
    NgApexchartsModule,
  ],
  templateUrl: './admin-view.component.html',
  styleUrl: './admin-view.component.css',
})
export class AdminViewComponent {
  totalPendingRetailerCount = 0;
  totalApprovedRetailerCount = 0;
  totalRejectedRetailerCount = 0;
  role = '';
  constructor(
    private authService: AuthService,
    private adminApprovalRightsService: AdminApprovalRightsService,
  ) { }

  userStatus: string | null = null;
  getUserByToken() {
    const userByToken = this.authService.getUserTypeByToken();
    userByToken.subscribe({
      next: (userData) => {
        console.log("userdata", userData)
        this.userStatus = userData.data.role_specific_details.approval_status;
        if (this.userStatus === 'approved') {
          this.getPendingCount();
          this.getApprovedCount();
          this.getRejectCount();
        }
      },
      error: () => { },
    });
  }

  ngOnInit(): void {
    this.getUserByToken();
    if (this.authService.isAdmin()) {
      this.role = 'admin'
    }
  }
  getPendingCount() {
    this.adminApprovalRightsService.getRequestsByStatus('pending', 10, 10).subscribe({
      next: (response) => {
        this.totalPendingRetailerCount = response.pagination.totalItems;
        console.log('totalPendingRetailerCount', this.totalPendingRetailerCount);

      },
    });
  }

  getApprovedCount() {
    this.adminApprovalRightsService.getRequestsByStatus("approved", 10, 10).subscribe({
      next: (response) => {
        this.totalApprovedRetailerCount = response.pagination.totalItems;
        console.log('totalPendingRetailerCount', this.totalPendingRetailerCount);

      },
    });
  }
  getRejectCount() {
    this.adminApprovalRightsService.getRequestsByStatus("rejected", 10, 10).subscribe({
      next: (response) => {
        this.totalRejectedRetailerCount = response.pagination.totalItems;
        console.log('totalPendingRetailerCount', this.totalPendingRetailerCount);
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { SuperadminDashboardService } from '../../services/superadmin-dashboard.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Admin } from '../../models/admin';
import { InfoChartsComponent } from '../info-charts/info-charts.component';

@Component({
  selector: 'app-superadmin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    NgApexchartsModule,
    InfoChartsComponent,
  ],
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.css'],
})
export class SuperadminDashboardComponent implements OnInit {
  approvedAdmins: Admin[] = [];
  pendingAdmins: Admin[] = [];
  rejectedAdmins: Admin[] = [];
  role = 'superadmin';

  totalPendingAdminsCount = 0;
  totalApprovedAdminsCount = 0;
  totalRejectedAdminsCount = 0;

  constructor(private superadminService: SuperadminDashboardService) { }

  ngOnInit(): void {
    this.getAllPendingadmins();
    this.getAllApprovedAdmins();
    this.getAllRejectedAdmins();
  }

  getAllPendingadmins() {
    this.superadminService.getRequestsByStatus('pending', 1, 1).subscribe({
      next: (response) => {
        this.totalPendingAdminsCount = response.pagination.totalItems;

      },
    });
  }

  getAllApprovedAdmins() {
    this.superadminService.getRequestsByStatus('approved', 1, 1).subscribe({
      next: (response) => {
        this.totalApprovedAdminsCount = response.pagination.totalItems;
      },
    });
  }

  getAllRejectedAdmins() {
    this.superadminService.getRequestsByStatus('rejected', 1, 1).subscribe({
      next: (response) => {
        this.totalRejectedAdminsCount = response.pagination.totalItems;
      },
    });
  }
}




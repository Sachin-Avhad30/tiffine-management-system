import { Component, OnInit } from '@angular/core';
import { AdminApprovalRightsService } from '../../services/admin-approval-rights.service';
import { Retailer } from '../../models/retailer';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RetailerStatusTableComponent } from '../retailer-status-table/retailer-status-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { debounceTime, distinctUntilChanged, forkJoin, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ActionDialogComponent } from '../action-dialog/action-dialog.component';
import { SnackbarService } from '../../services/snackbar.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-approval-rights.component.html',
  styleUrls: ['./admin-approval-rights.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    RetailerStatusTableComponent,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    FormsModule,
  ],
})
export class AdminDashboardComponent implements OnInit {
  approvedRetailers: Retailer[] = [];
  pendingRetailers: Retailer[] = [];
  rejectedRetailers: Retailer[] = [];
  allRetailers: Retailer[] = [];
  retailers: Retailer[] = [];
  currentPage: number = 1;
  limit: number = 100;
  status: string = 'pending';
  totalItems: number = 14;
  totalPages: number = 0;
  searchQuery!: string;
  retailerStatus!: string;
  searchedQueryNotFound: string = "";


  searchParam = {
    query: this.searchQuery,
    approval_status: this.retailerStatus,
  };
  private searchSubject = new Subject<string>();

  selectedOption: string | null = null;
  constructor(
    private adminService: AdminApprovalRightsService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {
    this.searchSubject
      .pipe(debounceTime(1500), distinctUntilChanged())
      .subscribe((query) => {
        this.searchAdminByMultipleEntity(query);
      });
  }

  ngOnInit(): void {
    console.log('in admin rights');

    // this.fetchAllRetailers();
    // this.getAllApprovedRetailers();
    // this.loadPendingRequests();
    // this.getAllRejectedRetailers();
    this.getAllRetailers('pending', this.currentPage, this.limit);
  }

  loadPendingRequests(): void {
    this.adminService.getPendingRequests().subscribe(
      (response) => {
        this.pendingRetailers = response.data;
        console.log('pending retailers:', this.pendingRetailers);
      },
      (error) => {
        console.error('Error fetching pending requests:', error);
      }
    );
  }

  getAllApprovedRetailers() {
    console.log('inside approved retailers...');

    this.adminService.getApprovedRequests().subscribe({
      next: (response) => {
        this.approvedRetailers = response.data;
        console.log('Approved retailers data:', this.approvedRetailers);
      },
      error: (err) => {
        console.error('Error fetching approved retailers', err);
        this.approvedRetailers = [];
      },
    });
  }

  getAllRejectedRetailers() {
    this.adminService.getRejectedRequests().subscribe({
      next: (response) => {
        this.rejectedRetailers = response.data;
        console.log('Rejected retailers data: ', this.rejectedRetailers);
      },
      error: (err) => {
        console.error('Error fetching rejected retailers', err);
      },
    });
  }

  fetchAllRetailers() {
    const approved = this.adminService.getApprovedRequests();
    const rejected = this.adminService.getRejectedRequests();
    const pending = this.adminService.getPendingRequests();

    forkJoin([approved, rejected, pending]).subscribe(
      ([approved, rejected, pending]) => {
        this.allRetailers = [
          ...approved.data.map((retailer: Retailer) => ({
            ...retailer,
            role_specific_details: {
              ...retailer.role_specific_details,
              approval_status: retailer.role_specific_details
                ?.approval_status || [{ approval_status: 'approved' }],
            },
          })),
          ...rejected.data.map((retailer: Retailer) => ({
            ...retailer,
            role_specific_details: {
              ...retailer.role_specific_details,
              approval_status: retailer.role_specific_details
                ?.approval_status || [{ approval_status: 'rejected' }],
            },
          })),
          ...pending.data.map((retailer: Retailer) => ({
            ...retailer,
            role_specific_details: {
              ...retailer.role_specific_details,
              approval_status: retailer.role_specific_details
                ?.approval_status || [{ approval_status: 'pending' }],
            },
          })),
        ];

        console.log('all retailers...', this.allRetailers);
      }
    );
  }

  getAllRetailers(status: string,
    currentPage: number,
    limit: number) {
    console.log('Fetching admin requests for status:', status);
    this.adminService.getRequestsByStatus(status, currentPage, limit).subscribe({
      next: (adminData) => {
        this.allRetailers = adminData.data;
        this.retailers = adminData.data;

        console.log('Fetched Retailer Requests:', this.allRetailers);
      },
      error: (err) => {
        console.error('Error fetching admin requests:', err);
      },
    });
  }

  updateStatusAprroved(id: any) {
    const approvedObservable = this.adminService.approveRetailer(id);
    approvedObservable.subscribe({
      next: (obj) => {
        console.log('obj.....', obj);
       
        this.router.navigate(['status']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateStatusRejected(event:any) {
    const rejectedObservable = this.adminService.rejectRetailer(event.id,event.reason);
    rejectedObservable.subscribe({
      next: (response) => {
        console.log('response for reject', response);

       
        this.router.navigate(['status']);
      },
    });
  }

  onStatusChange(event: any): void {
    this.status = event.value;
    this.getAllRetailers(this.status, this.currentPage, this.limit);
  }


  // openDialog(title: string, message: string) {
  //   const dialogRef = this.dialog.open(ActionDialogComponent);
  //   dialogRef.componentInstance.title = title;
  //   dialogRef.componentInstance.message = message;
  // }

  onSearchInput(event: any) {
    const query = event.target.value;
    this.searchSubject.next(query); 
  }
  searchAdminByMultipleEntity(searchQueryOnKeyUp: string) {
    console.log(
      'searchQuery-',
      this.searchQuery,
      'adminStatus-',
      this.retailerStatus
    );
    if (searchQueryOnKeyUp != '') {
      const searchedObservable = this.adminService.searchRetailer(
        searchQueryOnKeyUp,
        this.status
      );
      searchedObservable.subscribe({
        next: (searchRetailer) => {
          if (searchRetailer.data.length) {
            console.log(searchRetailer);
            this.allRetailers = searchRetailer.data;
          } else {
            console.log('Not Found');
            this.allRetailers = []
            this.searchedQueryNotFound = searchQueryOnKeyUp          }
        },
        error: (err) => {
          console.log(err);
          this.allRetailers = []
          this.searchedQueryNotFound = searchQueryOnKeyUp
        },
      });
    } else {
      this.allRetailers = this.retailers;
    }
  }
}

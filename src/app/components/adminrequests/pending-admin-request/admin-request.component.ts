import { Component } from '@angular/core';
import { SuperadminService } from '../../../services/superadmin.service';
import { Admin } from '../../../models/admin';
import { StatusTableComponent } from '../../status-table/status-table.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SnackbarService } from '../../../services/snackbar.service';
import { ActionDialogComponent } from '../../action-dialog/action-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SearchServiceService } from '../../../services/search-service.service';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-admin-request',
  standalone: true,
  imports: [
    StatusTableComponent,
    MatTabsModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatPaginatorModule,
  ],
  templateUrl: './admin-request.component.html',
  styleUrl: './admin-request.component.css',
  providers: [SearchServiceService]
})
export class AdminRequestComponent {
  adminsArray: Admin[] = [];
  allAdminsArray: Admin[] = [];
  rejectedAdminsArray: Admin[] = [];
  approvedAdminsArray: Admin[] = [];


  status: string = 'pending';

  pageSize: number = 10;
  totalItems!: number;
  currentPage: number = 1;
  totalPages!: number;

  searchQuery!: string;
  adminStatus!: string;

  searchedQueryNotFound: string = "";
  constructor(
    private superAdminService: SuperadminService,
    private router: Router,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private searchService: SearchServiceService,
  ) {
    this.searchService.getFilter().pipe(debounceTime(1500), distinctUntilChanged()).subscribe((query) => {
      console.log('searchQuery', query);
      this.searchAdminByMultipleEntity(query);
    });
  }
  ngOnInit(): void {
    this.getAdminRequestsByStatus('pending', this.currentPage, this.pageSize);

  }
  onPageChange(event: PageEvent): void {
    console.log('Page Event:', event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1
    if (this.currentPage <= this.totalPages) {
      this.getAdminRequestsByStatus(this.status, event.pageIndex + 1, this.pageSize);
    }
  }

  getAdminRequestsByStatus(
    status: string,
    currentPage: number,
    limit: number
  ): void {
    console.log('Fetching admin requests for status:', status);
    this.superAdminService
      .getRequestsByStatus(status, currentPage, limit)
      .subscribe({
        next: (adminData) => {
          console.log('Admin Data:', adminData);

          this.adminsArray = adminData.data;
          this.allAdminsArray = adminData.data;
          this.totalItems = adminData.pagination.totalItems;
          this.totalPages = adminData.pagination.totalPages;
          // this.totalPages = Math.ceil(this.totalItems / this.limit);
          console.log('Fetched Admin Requests:', this.adminsArray);
          // console.log('Total Pages:', this.totalPages);
        },
        error: (err) => {
          console.error('Error fetching admin requests:', err);
        },
      });
  }

  updateStatusAprroved(id: string) {
    const approvedObservable = this.superAdminService.approveAdminById(id);
    approvedObservable.subscribe({
      next: (obj) => {
        console.log(obj);
        this.getAdminRequestsByStatus(this.status, this.currentPage, this.pageSize);
        this.snackbar.showError('admin approved successfully');
      },
      error: (err) => {
        console.log(err);
        this.snackbar.showError('Error in approving admin');
      },
    });
  }

  updateStatusRejected(event: any) {
    const approvedObservable = this.superAdminService.rejectAdminById(event.id, event.message);
    approvedObservable.subscribe({
      next: (obj) => {
        console.log(obj);
        this.getAdminRequestsByStatus(this.status, this.currentPage, this.pageSize);
        this.snackbar.showError('admin rejected successfully');
      },
      error: (err) => {
        console.log(err);
        this.snackbar.showError('Error in rejecting admin');
      },
    });
  }
  onStatusChange(event: any): void {
    this.status = event.value;
    this.adminStatus = event.value;
    this.currentPage = 1;
    this.getAdminRequestsByStatus(this.status, this.currentPage, this.pageSize);
  }
  onSearchInput(event: any) {
    const query = event.target.value;
    this.searchService.setFilter(query);
  }
  searchAdminByMultipleEntity(searchQueryOnKeyUp: string) {
    console.log(
      'searchQuery-',
      this.searchQuery,
      'adminStatus-',
      this.adminStatus
    );

    if (searchQueryOnKeyUp != '') {
      console.log('searchQueryOnKeyUp', searchQueryOnKeyUp);
      const searchedObservable = this.superAdminService.searchAdmin(
        searchQueryOnKeyUp,
        this.status
      );
      searchedObservable.subscribe({
        next: (searchedAdmin) => {
          console.log("searchedAdmin", searchedAdmin);
          if (searchedAdmin.data.length) {
            console.log(searchedAdmin);
            this.adminsArray = searchedAdmin.data;
          } else {
            console.log('Not Found');
            this.adminsArray = []
            this.searchedQueryNotFound = searchQueryOnKeyUp
          }
        },
        error: (err) => {
          console.log(err);
          this.adminsArray = []
          this.searchedQueryNotFound = searchQueryOnKeyUp
        },
      });
    } else {
      this.adminsArray = this.allAdminsArray;
    }
  }
}
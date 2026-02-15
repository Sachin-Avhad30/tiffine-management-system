import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../services/organization.service';
import { Organization } from '../../models/organizations';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { OrganizationCardComponent } from '../organizationcard/organizationcard.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule,} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-superadmin',
  standalone: true,
  imports: [OrganizationCardComponent, CommonModule, MatPaginatorModule,MatCardModule,MatIconModule,MatFormFieldModule,FormsModule,MatInputModule],
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css'],
})

export class SuperadminComponent implements OnInit {
  organizationsArray: Organization[] = [];
  notFoundMessage=""
  flag:boolean=false;
  paginatedOrganizations: Organization[] = [];
  pageSize = 6; 
  currentPage = 0;
  totalItems = 0;
  totalPages = 0;
  searchQuery: string = '';
  private searchSubject = new Subject<string>();
  constructor(private organizationService: OrganizationService,private snackBar:SnackbarService) { 
  }

  ngOnInit(): void {
    this.getAllOrganizations(this.currentPage + 1, this.pageSize);
    this.setupSearch();
  }
  setupSearch(): void {
    this.searchSubject
      .pipe(debounceTime(1500), distinctUntilChanged())
      .subscribe((query) => {
        this.searchOrganizations(query);
      });
  }

  getAllOrganizations(page: number, limit: number): void {
    this.organizationService.getAllOrganizationsApi(page, limit).subscribe({
      next: (orgData) => {
        console.log("data",orgData);
        this.organizationsArray = orgData.data; 
        this.totalItems = orgData.pagination.totalItems; 
        this.totalPages = Math.ceil(this.totalItems / this.pageSize); 
        this.updatePaginatedOrganizations(); 
        this.organizationsArray = orgData.data; 
        this.totalItems = orgData.pagination.totalItems; 
        this.totalPages = Math.ceil(this.totalItems / this.pageSize); 
        this.updatePaginatedOrganizations(); 
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updatePaginatedOrganizations(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedOrganizations = this.organizationsArray.slice(startIndex, endIndex);
  }


  onPageChange(event: PageEvent): void {
    console.log('Page change event:', event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAllOrganizations(this.currentPage + 1, this.pageSize);
  }

  deleteOrganization(organizationId: string): void {
    console.log('Deleting organization with ID:', organizationId);
    this.organizationService.deleteOrganizations(organizationId).subscribe({
      next: (responseData) => {
        this.organizationsArray = this.organizationsArray.filter(
          (org) => org._id !== organizationId
        );
        this.updatePaginatedOrganizations();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // fetchAllOrganizations() {
  //   this.organizationService.getAllOrganizationApi(this.flag).subscribe({
  //     next: (responseData) => {
  //       console.log('responsedata', responseData);
  //       this.organizationsArray = responseData.data;
  //       this.totalItems = responseData.pagination.totalItems;
  //     },
  //     error: (e) => console.error('Error fetching slots:', e),
  //     complete: () => console.info('complete'),
  //   });
  // }


  // getOrg(orgName: string): void {
  //   if (orgName.trim() !== "") {
  //     const obs = this.organizationService.searchOrganization(orgName);
  //     obs.subscribe({
  //       next: (data) => {
  //         console.log(data)
  //         this.organizationsArray = data.data;
  //         if (this.organizationsArray && this.organizationsArray.length > 0) {
  //           this.notFoundMessage = ''; 
  //         } else {
  //           this.notFoundMessage = 'No organizations found';
  //         }
  //       },
  //       error: (error) => {
  //         console.error('API Error:', error);
  //         this.notFoundMessage = 'No organizations found'; 
  //       },
  //     });
  //   } else {
  //     this.notFoundMessage = '';
  //     this.getAllOrganizations(this.currentPage + 1, this.pageSize);
  //   }
  // }
  onSearchInput(event:any): void {
    this.searchQuery=event.target.value;
    console.log(this.searchQuery)
    this.searchSubject.next(this.searchQuery); 
  }

  searchOrganizations(query: string): void {
    if (query) {
      this.notFoundMessage=""
      this.organizationService.searchOrganization(query).subscribe({
        next: (searchedOrg) => {
          this.organizationsArray = searchedOrg.data;
          if (this.organizationsArray.length === 0) {
            this.notFoundMessage="No organization found"
            this.snackBar.showError(`No organization found with name "${query}"`);
          }
        },
        error: (err) => {
          console.error('Error during search:', err);
          this.notFoundMessage="No organization found"
          this.snackBar.showError(`Failed to search organizations`);
        },
      });
    } else {
       this.notFoundMessage=""
      this.getAllOrganizations(this.currentPage + 1, this.pageSize);
    }
  }  
}


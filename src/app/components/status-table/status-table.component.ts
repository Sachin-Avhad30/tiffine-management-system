import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Admin } from '../../models/admin';
import { MatIconModule } from '@angular/material/icon';
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActionDialogComponent } from '../action-dialog/action-dialog.component';
import { AdminActionDialogComponent } from '../admin-action-dialog/admin-action-dialog.component';
@Component({
  selector: 'app-status-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatSort,
    MatFormFieldModule,
    CommonModule,
  ],
  templateUrl: './status-table.component.html',
  styleUrl: './status-table.component.css',
})
export class StatusTableComponent implements OnInit {

  constructor(private dialog: MatDialog) { }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Admin>(this.adminsArray);
    this.dataSource.paginator = this.paginator;
  }
  displayedColumns: string[] = [
    'username',
    'email',
    'contact_number',
    'organization_name',
    'approval_status',
    '_id',
  ];
  dataSource: MatTableDataSource<Admin> = new MatTableDataSource<Admin>([]);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @Input()
  adminsArray: Admin[] = [];
  @Input() totalItems: number = 0;
  @Input() totalPages: number = 0;
  @Output()
  emitterApprove = new EventEmitter<string>();
  @Output()
  emitterReject = new EventEmitter<{ id: string, message: string }>();
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Input()
  searchedQueryNotFound!: string
  @Input()
  reason!: string
  @Input()
  currentPage: number = 1;
  @Input()
  pageSize: number = 10;
  noOrganization: string = "-"
  ngOnChanges(changes: SimpleChanges): void {
    // if (this.paginator) {
    //   console.log('inside if paginator');
    //   this.dataSource = new MatTableDataSource<Admin>(this.adminsArray);
    //   this.dataSource.paginator = this.paginator;
    // }
    // if (changes['totalItems'] && this.paginator) {
    //   this.dataSource = new MatTableDataSource<Admin>(this.adminsArray);
    //   this.dataSource.paginator = this.paginator;
    //   console.log('totalItems', this.totalItems);
    // }
    if (changes['adminsArray']) {
      this.dataSource.data = this.adminsArray;
    }
  }
  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
  openDialog(
    elementId: string,
    title: string,
    message: string,
    includeMessage: boolean,
    eventEmitter: EventEmitter<any>
  ): void {
    console.log("includeMessage", includeMessage);
    const dialogRef = this.dialog.open(AdminActionDialogComponent, {
      data: {
        title,
        message,
        includeMessage,
      },
      width: '366px',
      // height: 'fit-content',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'yes') {
        if (includeMessage) {
          console.log(
            `Action: ${title}, Item: ${elementId}, Message: ${result.message}`
          );
          eventEmitter.emit({ id: elementId, message: result.message });
        } else {
          console.log(`Action: ${title}, Item: ${elementId}`);
          eventEmitter.emit(elementId);
        }
      } else if (result?.action === 'no') {
        console.log(`User chose not to proceed with ${title}.`);
      }
    });
  }
  onReject(elementId: string): void {
    this.openDialog(
      elementId,
      'Reject Admin',
      'Are you sure you want to reject this Admin? if yes, please provide a reason',
      true,
      this.emitterReject
    );
  }
  onReason(event: any): void {
    console.log('reason', event);
    this.reason = event;
  }
  onApprove(elementId: string): void {
    this.openDialog(
      elementId,
      'Approve Admin',
      'Are you sure you want to approve this Admin?',
      false,
      this.emitterApprove
    );
  }
}
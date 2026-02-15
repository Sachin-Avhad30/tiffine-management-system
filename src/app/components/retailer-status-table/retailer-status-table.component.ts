import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Retailer } from '../../models/retailer';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AdminActionDialogComponent } from '../admin-action-dialog/admin-action-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-retailer-status-table',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatDividerModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './retailer-status-table.component.html',
  styleUrl: './retailer-status-table.component.css',
})
export class RetailerStatusTableComponent {
  @Input() retailers: Retailer[] = [];
  @Output()
  emitterApprove = new EventEmitter<string>();
  @Input() totalItems: number = 0;
  @Input()
  searchedQueryNotFound!: string
  @Output()
  emitterReject = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<{ page: number; limit: number }>();

  @Input()
  reason!: string

  displayedColumns: string[] = [
    'username',
    'email',
    'contact_number',
    'address',
    'status',
    '_id',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<Retailer>();
  constructor(private dialog: MatDialog) { }

  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log('retailers.....', this.retailers);
  //   if (changes['retailers'] && changes['retailers'].currentValue) {
  //     console.log('Updating table data in child component');
  //     this.dataSource.data = changes['retailers'].currentValue;
  //     this.dataSource.paginator = this.paginator;
  //     console.log('Updated data source:', this.dataSource.data);
  //   }
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.paginator) {
      console.log('inside if paginator');
      this.dataSource = new MatTableDataSource<Retailer>(this.retailers);
      this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    }
    if (changes['totalItems'] && this.paginator) {
      this.dataSource = new MatTableDataSource<Retailer>(this.retailers);
      this.dataSource.paginator = this.paginator;
      console.log('totalItems', this.totalItems);
    }
  }
  ngAfterViewInit(): void {
    if (this.dataSource) {
      console.log('in dataSource ngAfterViewInit');

      this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    }

    if (this.paginator) {
      this.paginator.length = this.totalItems;
      console.log('AfterViewInit - Paginator length:', this.paginator.length);
    }
  }

  onPageChange(event: PageEvent): void {
    const { pageIndex, pageSize } = event;
    console.log('emmitting');
    this.pageChange.emit({ page: pageIndex + 1, limit: pageSize });
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
      width: '452px',
      height: '356px'
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
      'Are you sure you want to reject this Admin?',
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

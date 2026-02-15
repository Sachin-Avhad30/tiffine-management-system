import { Component, EventEmitter,Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Organization } from '../../models/organizations';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DialogBodyComponent } from '../dialog-body/dialog-body.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-organization-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    CommonModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatDialogModule,
  ],
  templateUrl: './organizationcard.component.html',
  styleUrl: './organizationcard.component.css',
})
export class OrganizationCardComponent {
  @Input()
  organization!: Organization;

  @Output() deleteEventEmitter = new EventEmitter<string>();

  constructor(private dialog:MatDialog){}

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    const dialogRef = this.dialog.open(DialogBodyComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onDelete();
      } else {
        console.log('Deletion canceled');
      }
    });
  }

  onDelete(): void {
    this.deleteEventEmitter.emit(this.organization._id);
  }
}

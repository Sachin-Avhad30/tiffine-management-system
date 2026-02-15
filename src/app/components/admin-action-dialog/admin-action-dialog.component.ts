import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-admin-action-dialog',
  standalone: true,
  imports: [MatFormField, MatLabel, FormsModule, MatButtonModule, MatIcon],
  providers: [{
    provide: MAT_DIALOG_DEFAULT_OPTIONS,
    useValue: {
      maxWidth: 'fit-content',
      maxHeight: 'fit-content',
      panelClass: 'custom-dialog-container',
      autoFocus: true,
    } as MatDialogConfig,
  },],
  templateUrl: './admin-action-dialog.component.html',
  styleUrl: './admin-action-dialog.component.css'
})
export class AdminActionDialogComponent {
  @Output() reasonEmitter = new EventEmitter<string>();
  reason: string = ''
  userMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<AdminActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close({ action: 'no' });
  }

  onYesClick(): void {
    this.dialogRef.close({ action: 'yes', message: this.userMessage });
    this.reason = this.userMessage
    console.log('reason', this.reason);
    this.emitReason();
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
  emitReason(): void {
    this.reasonEmitter.emit(this.reason);
  }
}
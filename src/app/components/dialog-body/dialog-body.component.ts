import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-body',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css'], // Corrected to styleUrls
})
export class DialogBodyComponent {
  constructor(public dialogRef: MatDialogRef<DialogBodyComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}

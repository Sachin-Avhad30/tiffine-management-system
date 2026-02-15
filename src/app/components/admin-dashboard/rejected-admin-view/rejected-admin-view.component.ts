import { Component } from '@angular/core';
import { AdminApprovalRightsService } from '../../../services/admin-approval-rights.service';
import { AuthService } from '../../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-rejected-admin-view',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './rejected-admin-view.component.html',
  styleUrl: './rejected-admin-view.component.css'
})
export class RejectedAdminViewComponent {
  constructor(private adminService: AdminApprovalRightsService, private authService: AuthService) { }
  onReApply(): void {
    const adminId = sessionStorage.getItem('id');
    console.log('adminId', adminId);
    if (adminId != null) {
      const reapply = this.adminService.reApply(adminId);
      reapply.subscribe({
        next: (response) => {
          console.log('reapply', response);
        },
        error: (error) => {
          console.log('error', error);
        },
      });
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { Menus } from '../../models/menus';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    RouterModule,
    MatSidenavModule,
    CommonModule,
    MatListModule,
    MatButtonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  userImageUrl: string = '';

  image!: string;
  adminMenus: Menus[] = [
    {
      label: `Dashboard`,
      redirectURL: '/navbar/admin',
      icon: 'dashboard',
    },
    {
      label: 'retailer-Status',
      redirectURL: '/navbar/status',
      icon: 'check_circle',
    },
    {
      label: 'Logout',
      redirectURL: '/logout',
      icon: 'exit_to_app',
    },
  ];
  superAdminMenus: Menus[] = [
    {
      label: `Dashboard`,
      redirectURL: '/navbar/home',
      icon: 'dashboard',
    },
    {
      label: 'Admin Status',
      redirectURL: '/navbar/statusDataTable',
      icon: 'check_circle',
    },
    {
      label: 'Add Organization',
      redirectURL: '/navbar/add-organization',
      icon: 'add_circle_outline',
    },
    {
      label: 'View Organization',
      redirectURL: '/navbar/view-all-organizations',
      icon: 'visibility',
    },
    {
      label: 'Logout',
      redirectURL: '/logout',
      icon: 'exit_to_app',
    },
  ];
  menus: Menus[] = [];
  role!: boolean;

  setMenusByRole() {
    if (this.authService.isSuperAdmin()) {
      this.menus = this.superAdminMenus;
      console.log('insidetrueIsSuperAdmn', this.authService.isSuperAdmin());
    } else if (this.authService.isAdmin()) {
      console.log('insidetrueIsAdmin', this.authService.isAdmin());
      this.menus = this.adminMenus;
    }
    console.log('menus-setMenusByRole', this.menus);
  }
  ngOnInit(): void {
    this.authService.role$.subscribe((role) => {
      if (role) {
        console.log('role', role);
        console.log("menus", this.menus);

        this.setMenusByRole();
      }
    });
    this.fetchUserProfileImage();
    this.role = this.authService.isAdmin()

  }
  collapsed: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: SnackbarService
  ) { }




  fetchUserProfileImage(): void {
    const userId = 'USER_ID'; // Replace with actual user ID

    const adminDetails = this.authService.getUserTypeByToken()
    adminDetails.subscribe({
      next: (formData) => {
        console.log("profile details", formData.data);
        this.image = formData.data.user_image

      }
    })
  }

  collapsedState() {
    this.collapsed = !this.collapsed;
    console.log(this.collapsed);
  }

  sidenavWidth() {
    return this.collapsed ? '65px' : '250px';
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    this.snackBar.showError('Logged out successfully...');
    this.router.navigate(['/']);
  }

  updateProfile() {

    this.router.navigate(['/navbar/profile-update'])

  }
}

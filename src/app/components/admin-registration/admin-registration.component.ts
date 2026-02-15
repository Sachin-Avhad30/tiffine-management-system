import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Organization, Location } from '../../models/organizations';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrganizationService } from '../../services/organization.service';
import { MatIconModule } from '@angular/material/icon';
import { CustomPasswordValidators } from '../../customValidators/custom-password-validators';
import { markAllControlsAsDirtyAndTouched } from '../../utils';
import { SnackbarService } from '../../services/snackbar.service';
import { ADMIN_ROLE_ID } from '../../utils/const';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-admin-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatIconModule,
    CommonModule,
    RouterModule,
    ScrollingModule,
  ],
  templateUrl: './admin-registration.component.html',
  styleUrl: './admin-registration.component.css',
})
export class AdminRegistrationComponent {
  adminForm: FormGroup;
  organizations: Organization[] = [];
  locations: Location[] = [];
  totalItems = 0;
  strongPassword: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  flag: boolean = false;
  isUpdateMode: boolean = true;
  id: string = '';
  userStatus = 'pending';
  imageUrl!: string;

  constructor(
    private authService: AuthService,
    private organizationService: OrganizationService,
    private router: Router,
    private snackbar: SnackbarService,
    private route: ActivatedRoute
  ) {
    this.adminForm = new FormGroup({
      userName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9.\-_$@*!]+$/),
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      contactNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/),
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),
      password: new FormControl('', [
        Validators.required,
        // Validators.pattern(this.strongPassword),
        Validators.minLength(8),
        CustomPasswordValidators.logPatternError(),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      roleId: new FormControl(ADMIN_ROLE_ID),
      roleSpecificDetails: new FormGroup({
        organizationId: new FormControl('', Validators.required),
        orgLocation: new FormControl('', [Validators.required]),
        approvalStatus: new FormControl('pending'),
      }),
      userImage: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.fetchAminById();
    this.fetchAllOrganizations();
    this.confirmPassword?.valueChanges.subscribe(() => {
      this.checkPasswordsMatch();
    });
    this.isUpdateMode =
      this.route.snapshot.routeConfig?.path === 'profile-update';
    console.log('update mode....', this.isUpdateMode);
  }
  checkPasswordsMatch() {
    const password = this.password?.value;
    const confirmPassword = this.confirmPassword?.value;
    if (password && confirmPassword) {
      const matchError = password === confirmPassword ? null : { match: true };
      this.adminForm.get('confirmPassword')?.setErrors(matchError);
    }
  }

  get userName() {
    return this.adminForm.get('userName');
  }
  get errorMessageUserName(): string {
    const control = this.userName;
    if (!control) return '';
    if (control.dirty && control.touched) {
      switch (true) {
        case control.hasError('required'):
          return 'Username is required!';
        case control.hasError('pattern'):
          return 'Only letters, numbers, and special characters . - _ $ @ * ! are allowed.';
        case control.hasError('minlength'):
          return 'Username is at least 3 character!';
        case control.hasError('maxlength'):
          return 'Maximum length is 20 characters.';
        default:
          return '';
      }
    } else {
      return '';
    }
  }
  get email() {
    return this.adminForm.get('email');
  }
  get errorMessageEmail(): string {
    const control = this.email;
    if (!control) return '';
    if (control.dirty && control.touched) {
      switch (true) {
        case control.hasError('required'):
          return 'Email is required!';
        case control.hasError('email'):
          return 'Please enter valid email';
        default:
          return '';
      }
    } else {
      return '';
    }
  }
  get contactNumber() {
    return this.adminForm.get('contactNumber');
  }
  get errorMessageContactNumber(): string {
    const control = this.contactNumber;
    if (!control) return '';
    if (control.dirty && control.touched) {
      switch (true) {
        case control.hasError('required'):
          return 'Contact Number is required!';
        case control.hasError('pattern'):
          return 'Contact number must be exactly 10 digits!';
        default:
          return '';
      }
    } else {
      return '';
    }
  }
  get address() {
    return this.adminForm.get('address');
  }
  get errorMessageAddress(): string {
    const control = this.address;
    if (!control) return '';
    if (control.dirty && control.touched) {
      switch (true) {
        case control.hasError('required'):
          return 'Address is required!';
        case control.hasError('minlength'):
          return 'Address is at least 5 character!';
        case control.hasError('maxlength'):
          return 'Address length is 50 characters.';
        default:
          return '';
      }
    } else {
      return '';
    }
  }
  get password() {
    return this.adminForm.get('password');
  }
  get errorMessagePassword(): string {
    const control = this.password;
    if (!control) return '';
    if (control.dirty && control.touched) {
      switch (true) {
        case control.hasError('required'):
          return 'Password is required!';
        case control.hasError('minlength'):
          return 'Minimum 8 characters are required.';
        case control.errors?.['noNumber']:
          return 'At least one number is required.';
        case control.errors?.['noSpecialChars']:
          return 'At least one special character is required.';
        case control.errors?.['noLowerCase']:
          return 'At least one lowercase character is required.';
        case control.errors?.['noUpperCase']:
          return 'At least one uppercase character is required.';
        default:
          return '';
      }
    } else {
      return '';
    }
  }

  get confirmPassword() {
    return this.adminForm.get('confirmPassword');
  }

  get errorMessageConfirmPassword(): string {
    const control = this.adminForm.get('confirmPassword');
    if (!control) return '';

    if (control.touched && control.dirty) {
      if (control.hasError('match')) {
        return 'Passwords do not match!';
      }
      if (control.hasError('required')) {
        return 'Confirm password is required!';
      }
    }
    return '';
  }

  get organizationId() {
    return this.adminForm.get('roleSpecificDetails.organizationId');
  }
  // get approvalStatus() {
  //   return this.adminForm.get('roleSpecificDetails.approvalStatus');
  // }
  get errorMessageOrganization(): string {
    const control = this.organizationId;
    if (!control) return '';
    if (control.touched && control.dirty) {
      switch (true) {
        case control.hasError('required'):
          return 'Please select organization!';
        default:
          return '';
      }
    } else {
      return '';
    }
  }
  get orgLocation() {
    return this.adminForm.get('roleSpecificDetails.orgLocation');
  }
  get errorMessageOrganizationLocation(): string {
    const control = this.orgLocation;
    if (!control) return '';
    if (control.touched && control.dirty) {
      switch (true) {
        case control.hasError('required'):
          return 'Please select organization location!';
        default:
          return '';
      }
    } else {
      return '';
    }
  }
  fetchAllOrganizations() {
    this.organizationService.getAllOrganizationApi(this.flag).subscribe({
      next: (responseData) => {
        console.log('responsedata', responseData);
        this.organizations = responseData.data;
        this.totalItems = responseData.pagination.totalItems;
      },
      error: (e) => console.error('Error fetching slots:', e),
      complete: () => console.info('complete'),
    });
  }

  onOrganizationChange(organizationId: string): void {
    console.log('orgid', organizationId);
    this.adminForm
      .get('roleSpecificDetails.organizationId')
      ?.setValue(organizationId);

    this.organizationService.getOrganizationById(organizationId).subscribe({
      next: (organizationData) => {
        console.log(organizationData);

        this.locations = organizationData.data.org_location;
        console.log('Selected Organization:', this.locations);
      },
      error: (err) => {
        console.error('Error fetching organization by ID:', err);
        this.snackbar.showError('Failed to fetch organization details');
      },
    });
  }
  onLocationChange(orgLocation: string) {
    console.log('Selected location:', orgLocation);
    this.adminForm
      .get('roleSpecificDetails.orgLocation')
      ?.setValue(orgLocation);
  }

  CollectData() {
    console.log('llllllllll', this.adminForm.value);
    if (this.adminForm.valid) {
      const { confirmPassword, ...formData } = this.adminForm.value;
      (formData.username = formData.userName),
        (formData.password = formData.password),
        (formData.email = formData.email),
        (formData.contact_number = formData.contactNumber),
        (formData.address = formData.address),
        (formData.role_id = formData.roleId),
        (formData.user_image=this.imageUrl);
        (formData.role_specific_details = {
          organization_id: formData.roleSpecificDetails.organizationId,
          org_location: formData.roleSpecificDetails.orgLocation,
          approval_status: this.userStatus,
        });
      console.log('Mapped Payload for Backend:', formData);

      if (this.isUpdateMode) {
        const updateProfileObservable = this.authService.updateProfile(
          this.id,
          formData
        );
        console.log('iddddddd', this.id);
        updateProfileObservable.subscribe({
          next: (response) => {
            // console.log("rrrrrrrrrrr",response);
            this.snackbar.showSuccess('Profile updated successfully...');
          },
        });
        console.log('yuyuyuyu', this.userStatus);

        console.log('formdata', formData);
      } else {
        this.authService.register(formData).subscribe({
          next: (responseData) => {
            console.log('Register', responseData);
            if (responseData.statusCode === 201) {
              console.log('Admin Registered Data', responseData);
              this.snackbar.showSuccess('Registration successfully!');
              this.router.navigate(['/']);
            }
          },
          error: (error) => {
            this.snackbar.showError('Registration failed:');
            console.log('Registration failed:...', error);
          },
        });
      }
    } else {
      markAllControlsAsDirtyAndTouched(this.adminForm);
      this.snackbar.showError('Please Fill in all required information');
    }
  }

  fetchAminById() {
    const adminDetails = this.authService.getUserTypeByToken();
    adminDetails.subscribe({
      next: (formData) => {
        this.id = formData.data._id;
        this.userStatus = formData.data.role_specific_details.approval_status;
        console.log('uderedfrdd', this.userStatus);

        console.log(
          'Role Specific Details:',
          formData.data.role_specific_details
        );
        console.log(
          'Org Location:',
          formData.data.role_specific_details.org_location
        );
        console.log('profile details', formData.data);
        this.patchFormData(formData.data);
      },
    });
  }

  patchFormData(data: any) {
    // Patch the form fields with the fetched data
    if (data.role_specific_details && data.role_specific_details.org_location) {
      this.adminForm.patchValue({
        userName: data.username,
        email: data.email,
        contactNumber: data.contact_number,
        address: data.address,
        roleId: data.role_id,
        password: data.password,
        confirmPassword: data.password,
        roleSpecificDetails: {
          organizationId: data.role_specific_details.organization_id,
          orgLocation: data.role_specific_details.org_location,
          approvalStatus: data.role_specific_details.approval_status,
        },
      });

      this.adminForm.markAllAsTouched();
    }
  }

  onFileSelected(event: Event){
   const imageControl=(event.target as HTMLInputElement).files?.[0];
   if(imageControl){
    this.authService.uploadImage(imageControl).subscribe({
      next:(response)=>{
        console.log("image",response.image);
        this.imageUrl=response.image;
      }
    })

   }
  }
}

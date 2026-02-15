import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login, Roles, TokenResponse } from '../models/userlogin';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Admin, AdminRegister, CloudinaryResponse } from '../models/admin';
import { JwtHelperService } from "@auth0/angular-jwt";

import { UserByToken } from '../models/admin';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
    const role = sessionStorage.getItem('role');
    if (role) {
      this.roleSubject.next(role);
    }
  }
  private jwtHelper = new JwtHelperService();

  baseUrlLogin = environment.apiEndpointauth + '/login';
  authenticateLogin(loginCredentials: Login): Observable<TokenResponse> {
    console.log(environment.apiEndpointOrganization);
    console.log(environment.apiEndpointauth + '/login');
    const data = this.http.post<TokenResponse>(this.baseUrlLogin, loginCredentials);
    return data;
  }

  private roleSubject = new BehaviorSubject<string | null>(null);
  public role$ = this.roleSubject.asObservable();

  setRole(role: string): void {
    sessionStorage.setItem('role', role);
    this.roleSubject.next(role);
  }
  getRole(): string | null {
    return sessionStorage.getItem('role');
  }

  isSuperAdmin(): boolean {
    console.log('this.roleSubject.getValue()', this.roleSubject.getValue());
    return this.roleSubject.getValue() === Roles.SUPER_ADMIN;
  }
  isAdmin(): boolean {
    console.log('this.roleSubject.getValue()', this.roleSubject.getValue());
    return this.roleSubject.getValue() === Roles.ADMIN;
  }

  getUserTypeByToken(): Observable<UserByToken> {
    const baseUrlUserType = environment.apiEndpointauth + '/getuserbytoken';
    const userData = this.http.get<UserByToken>(baseUrlUserType);
    return userData;
  }

  isAuthenticated(): boolean {
    const setToken = sessionStorage.getItem('token');
    if (setToken) {
      return true;
    }
    return false;
  }
  saveTokens(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem('token', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);
  }
  clearTokens(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
  }
  isAccessTokenExpired(): boolean {
    const token = sessionStorage.getItem('token');
    if (!token) return true;
    console.log('all response of reffresh token', this.jwtHelper.decodeToken(token));

    const isTokenExpired = this.jwtHelper.isTokenExpired(token);
    return isTokenExpired;
  }
  refreshTokens(): Observable<TokenResponse> {
    const refreshTokenOld = sessionStorage.getItem('refreshToken')
    const refreshTokenUrl = environment.apiEndpointauth + '/refreshtoken';
    return this.http.post<TokenResponse>(refreshTokenUrl, { refreshToken: refreshTokenOld });
  }

  forgotPassword(userEmail: string): Observable<TokenResponse> {
    const refreshTokenUrl = environment.apiEndpointauth + '/forgotpassword';
    return this.http.post<TokenResponse>(refreshTokenUrl, { email: userEmail });
  }

  resetPassword(resetPasswordToken: string, resetPassword: string) {

    const resetPasswordUrl = `${environment.apiEndpointauth}/resetpassword?token=${resetPasswordToken}`
    const body = {
      password: resetPassword
    }
    const params = new HttpParams().set('token', resetPasswordToken)
    return this.http.post<TokenResponse>(resetPasswordUrl, body);
  }
  logout() {
    this.clearTokens();
    // this.snackbar.showError('Logged out successfully');
    this.router.navigate(['/']);
  }
  baseUrlRegistration = environment.apiEndpointauth + '/register';
  register(formData: Admin): Observable<AdminRegister> {

    // console.log(admin)
    return this.http.post<AdminRegister>(this.baseUrlRegistration, formData);
  }
  // this.http.get<{ user_image: string }>(`/api/user/${userId}`).subscribe({
  //   next: (response) => {
  //     this.userImageUrl = response.user_image;
  //   },
  //   error: (err) => {
  //     console.error('Error fetching user profile image:', err);
  //   },
  // });
  baseUrlUserImage = environment.apiEndpointauth + '/uploaduserimage';
  uploadUserImage(userId: string, file: File): Observable<AdminRegister> {
    const formData = new FormData();
    formData.append('recfile', file);

    return this.http.post<AdminRegister>(
      `${this.baseUrlUserImage}/uploaduserimage/${userId}`,
      formData
    );
  }

  updateProfile(id: string, formadata: Admin) {
    const obs = this.http.put(`${environment.apiEndpointauth}/updateprofile/${id}`, formadata)
    console.log("in update profile service");
    return obs;

  }

  uploadImage(file: File): Observable<CloudinaryResponse> {
    const baseUrlOrgImage = environment.apiEndpointauth + '/uploaduserimage'
    let formData = new FormData();
    formData.append('recfile', file)
    const observableData = this.http.post<CloudinaryResponse>(
      baseUrlOrgImage,
      formData
    );
    return observableData;
  }

}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AllAdminStatusResponses } from '../models/admin';

@Injectable({
  providedIn: 'root',
})
export class SuperadminDashboardService {
  constructor(private http: HttpClient) { }

  getPendingRequests(): Observable<AllAdminStatusResponses> {
    const response = this.http.get<AllAdminStatusResponses>(
      environment.apiEndpointSuperAdmin + '/pendingAdminApproval'
    );
    console.log(response);
    return response;
  }

  getRejectedRequests(): Observable<AllAdminStatusResponses> {
    const response = this.http.get<AllAdminStatusResponses>(
      environment.apiEndpointSuperAdmin + '/rejectedAdminApproval'
    );
    console.log(response);
    return response;
  }
  getApprovedRequests(): Observable<AllAdminStatusResponses> {
    const response = this.http.get<AllAdminStatusResponses>(
      environment.apiEndpointSuperAdmin + '/approvedAdminApproval'
    );
    console.log(response);
    return response;
  }
  getRequestsByStatus(
    adminStatus: string,
    pageNo: number,
    limitItems: number
  ): Observable<AllAdminStatusResponses> {
    console.log('inside getRequestsByStatus');
    // http://localhost:5000/api/superadmin/getalladminrequest?status=rejected
    const param = {
      status: adminStatus,
      page: pageNo,
      limit: limitItems
    }
    // const apiUrl = `${environment.apiEndpointSuperAdmin}/getalladminrequest?status=${status}&page=${page}&limit=${limit}`;

    const apiUrl = `${environment.apiEndpointSuperAdmin}/getalladminrequest`;
    console.log('apiUrl', apiUrl);
    return this.http.get<AllAdminStatusResponses>(apiUrl, { params: param });
  }

}

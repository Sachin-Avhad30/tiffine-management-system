import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AllAdminStatusResponses } from '../models/admin';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SuperadminService {
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
    console.log("pageNo received in the service", pageNo);

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

  approveAdminById(id: string): Observable<Object> {
    console.log('inside approveAdminById----id with admin', id);

    const approveAdminUrl =
      environment.apiEndpointSuperAdmin + '/approveadmin/' + id;
    return this.http.put<Object>(approveAdminUrl, {});
  }
  rejectAdminById(id: string, reason: string): Observable<Object> {
    console.log('inside rejectAdminById----id with admin', id);

    const rejectAdminUrl =
      environment.apiEndpointSuperAdmin + '/rejectadmin/' + id;
    return this.http.put<Object>(rejectAdminUrl, { rejection_reason: reason });
  }

  searchAdmin(
    querySearch: string,
    approvalStatus: string
  ): Observable<AllAdminStatusResponses> {

    const param = {
      query: querySearch,
      approval_status: approvalStatus
      // const rejectAdminUrl = `${environment.apiEndpointSuperAdmin}/searchAdminApproval?query=${querySearch}&approval_status=${approvalStatus}`;
    }
    const rejectAdminUrl = `${environment.apiEndpointSuperAdmin}/searchAdminApproval`
    return this.http.get<AllAdminStatusResponses>(rejectAdminUrl, { params: param });
  }
}

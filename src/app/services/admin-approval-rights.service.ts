import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AllStatusResponses } from '../models/retailer';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminApprovalRightsService {
  constructor(private http: HttpClient) { }
  getPendingRequests(): Observable<AllStatusResponses> {
    const response = this.http.get<AllStatusResponses>(
      environment.apiEndpointAdmin + '/pendingRetailers'
    );

    console.log('response', response);
    return response;
  }

  getRejectedRequests(): Observable<AllStatusResponses> {
    const response = this.http.get<AllStatusResponses>(
      environment.apiEndpointAdmin + '/getrejectedRetailers'
    );
    console.log(response);
    return response;
  }
  getApprovedRequests(): Observable<AllStatusResponses> {
    const response = this.http.get<AllStatusResponses>(
      environment.apiEndpointAdmin + '/getapprovedRetailers'
    );
    return response;
  }

  getRequestsByStatus( retailerStatus: string,
    pageNo: number,
    limitItems: number): Observable<AllStatusResponses> {
    console.log('inside getRequestsByStatus', retailerStatus);
    const param = {
      status: retailerStatus,
      page: pageNo,
      limit: limitItems
    }
    const apiUrl = `${environment.apiEndpointAdmin}/getallRetailers`;
    console.log('apiUrl', apiUrl);
    return this.http.get<AllStatusResponses>(apiUrl, { params: param });
  }

  approveRetailer(id: string): Observable<Object> {
    const approveRetailerUrl =
      environment.apiEndpointAdmin + '/approveRetailer/' + id;
    return this.http.put<Object>(approveRetailerUrl, {});
  }

  rejectRetailer(id: string, reason:string): Observable<Object> {
    const param={
      rejection_reason:reason
    }
    const approveRetailerUrl =
      environment.apiEndpointAdmin + '/rejectRetailer/' + id;
    return this.http.put<Object>(approveRetailerUrl, {params:param});
  }

  searchRetailer(
    querySearch: string,
    approvalStatus: string
  ): Observable<AllStatusResponses> {
    const rejectRetailerUrl = `${environment.apiEndpointAdmin}/searchRetailer?query=${querySearch}&approval_status=${approvalStatus}`;
    return this.http.get<AllStatusResponses>(rejectRetailerUrl);
  }

  reApply(id: string): Observable<Object> {
    const reApplyUrl = `${environment.apiEndpointAdmin}/reapply/${id}`;
    return this.http.put<Object>(reApplyUrl, {});
  }
}

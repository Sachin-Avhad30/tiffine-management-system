import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  allOrganization,
  allOrganizations,
  Organization,
} from '../models/organizations';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  baseUrlOrg = environment.apiEndpointOrganization + '/getallOrganization';
  addOrgUrl = environment.apiEndpointOrganization + '/addOrganization';
  deleteOrgUrl = environment.apiEndpointOrganization + '/deleteOrganization';
  getOrgByIdUrl = environment.apiEndpointOrganization + '/getOrganization';
  updateOrgUrl = environment.apiEndpointOrganization + '/updateOrganization';
  searchOrgUrl = environment.apiEndpointOrganization + '/searchOrganizations';
  baseUrlOrgImage = environment.apiEndpointOrganization + '/upload';
  constructor(private http: HttpClient) {}
  getAllOrganizationsApi(
    page: number,
    limit: number,
  ): Observable<allOrganization> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    const observableData = this.http.get<allOrganization>(this.baseUrlOrg, {
      params,
    });
    return observableData;
  }
  getAllOrganizationApi(flag: boolean): Observable<allOrganization> {
    const params = new HttpParams().set('status', flag.toString());
    const observableData = this.http.get<allOrganization>(this.baseUrlOrg, {
      params,
    });
    // console.log('jhgj', observableData);
    return observableData;
  }
  addOrganizations(formData: Organization): Observable<allOrganization> {
    const observableData = this.http.post<allOrganization>(
      this.addOrgUrl,
      formData,
    );
    return observableData;
  }

  deleteOrganizations(id: string): Observable<allOrganization> {
    console.log(id);
    const observableData = this.http.delete<allOrganization>(
      `${this.deleteOrgUrl}/${id}`,
    );
    return observableData;
  }

  getOrganizationById(id: string): Observable<allOrganizations> {
    const observableData = this.http.get<allOrganizations>(
      `${this.getOrgByIdUrl}/${id}`,
    );
    return observableData;
  }

  updateOrganization(
    id: string,
    formData: Organization,
  ): Observable<allOrganization> {
    const observableData = this.http.put<allOrganization>(
      `${this.updateOrgUrl}/${id}`,
      formData,
    );
    return observableData;
  }

  // searchOrganization(orgName:string): Observable<allOrganization>{
  //   const params = new HttpParams()
  //   .set('query', orgName.toString());
  //   const observableData = this.http.get<allOrganization>(`${this.searchOrgUrl}`,{params});
  //   return observableData;
  // }
  searchOrganization(orgName: string): Observable<allOrganization> {
    const encodedQuery = encodeURIComponent(orgName);
    // const params = new HttpParams().set('query', encodedQuery);
    const observableData = this.http.get<allOrganization>(
      `${this.searchOrgUrl}?query=${encodedQuery}`,
    );
    console.log(observableData);
    return observableData;
  }

  uploadOrgImage(file: File): Observable<allOrganization> {
    let formData = new FormData();
    formData.append('recfile', file);
    const observableData = this.http.post<allOrganization>(
      this.baseUrlOrgImage,
      formData,
    );
    return observableData;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpParams  } from '@angular/common/http'
import { Global } from '../models/global';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  url:string
  constructor(private _http:HttpClient) { 
    this.url = Global.apiUrl
  }


  getClients(page: number) {
    const params = new HttpParams().set('page', page.toString());

    return this._http.get<any>(`${this.url}/clients`, { params });
  }

  getClient(id:any){
    return this._http.get<any>(`${this.url}/clients/${id}`);
  }

  addClient(data:any){
    return this._http.post<any>(this.url+'/clients',data);
  }

  updateClient(id:any,data:any){
    return this._http.put<any>(`${this.url}/clients/${id}`,data);
  }

  getClientFilter(filter: string, data: string){
    const params = new HttpParams()
    .set('filter', filter)
    .set('data', data);
    return this._http.get<any>(`${this.url}/clientsFilter`, { params });
  }

  getClientByLoan(id:any){
    return this._http.get<any>(`${this.url}/client/${id}`)
  }

}

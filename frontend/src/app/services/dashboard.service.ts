import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpParams  } from '@angular/common/http'
import { Global } from '../models/global';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url:string
  constructor(private _http:HttpClient) { 
    this.url = Global.apiUrl
  }

  getData(){
    return this._http.get<any>(this.url+'/dashboard')
  }

  getDataByMonth(date:string) {
    return this._http.get<any>(`${this.url}/dashboard/${date}`)
  }

  getDataByDay(day:string) {
    return this._http.get<any>(`${this.url}/dashboardDay/${day}`)
  }

  getDataUser(date:string){
    return this._http.get<any>(`${this.url}/dataUser/${date}`)
  }

}

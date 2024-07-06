import { Injectable } from '@angular/core';
import { Global } from '../models/global';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PayService {

  url:string
  constructor(private _http : HttpClient) {
    this.url = Global.apiUrl
   }

   getPays(id:number){
    return this._http.get<any>(`${this.url}/getPaysByLoan/${id}`)
   }
  
   getPaysActive(id:number){
    return this._http.get<any>(`${this.url}/getPaysActive/${id}`)
   }

   getPaysLader(id:number){
    return this._http.get<any>(`${this.url}/getPaysLader/${id}`)
   }

   addPay(data:any){
    return this._http.post<any>(this.url+'/pays',data)
   }

   updatePay(id:any,data:any){
    return this._http.put<any>(`${this.url}/pays/${id}`,data)
   }
}

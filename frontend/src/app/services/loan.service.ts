import { Injectable } from '@angular/core';
import { Global } from '../models/global';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  url:string
  constructor(private _http : HttpClient) {
    this.url = Global.apiUrl
   }

   getLoans(){
    return this._http.get<any>(this.url+'/loans')
   }

   getLoansActive(){
    return this._http.get<any>(this.url+'/loanActive')
   }

   addLoan(data:any){
    return this._http.post<any>(this.url+'/loans',data)
   }

   getLoanById(id:any){
    return this._http.get<any>(`${this.url}/loan/${id}`)
   }

   getLoansByUser(id:any){
    return this._http.get<any>(`${this.url}/loansClient/${id}`)
   }

}

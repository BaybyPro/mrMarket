import { HttpClient, HttpErrorResponse,HttpClientModule } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Global } from '../models/global';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url:string

  constructor(private _http:HttpClient,
    private router:Router
  ) {
    this.url = Global.apiUrl
   }


   login(user: any) {
    return this._http.post<any>(this.url + '/login', user, { withCredentials: true });
  }

  public isAuthenticated():boolean{
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    } else {
      return true;
    }
  }

  register(data:any){
    return this._http.post<any>(this.url+'/register',data);
  }

  getUser(){
    return this._http.get<any>(this.url+'/user')
  }
  getUsers(){
    return this._http.get<any>(this.url+'/users')
  }

  getUserById(id:any){
    return this._http.get<any>(`${this.url}/user/${id}`)
  }

  getUsersByIds(data:any){
    return this._http.post<any>(this.url+'/getUsersByIds',data);
  }

  editUser(data:any,id:number){
    return this._http.put<any>(`${this.url}/user/${id}`,data)
  }

  deleteUser(id:number){
    return this._http.delete<any>(`${this.url}/user/${id}`)
  }
  

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

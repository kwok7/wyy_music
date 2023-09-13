import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/xmly/src/environments/environment';
import { Observable, map } from 'rxjs';
import { Base, User } from './types';


interface loginParams{
  phone?:string|null,
  password?:string|null
}

interface LoginType{
  token:string,
  user:User
}
@Injectable({
  providedIn: 'root'
})

export class UserService {

  readonly prefix = '/xmly/';

  constructor(
    private http:HttpClient
  ) { }

  login(paras:loginParams):Observable<LoginType>{
    return this.http.post(`${environment.baseUrl}${this.prefix}login`,paras).pipe(
      map((res:any)=>res.data)
    )
  }

}

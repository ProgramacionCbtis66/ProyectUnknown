import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import * as Notiflix from 'notiflix';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private jwt: JwtHelperService) { }

  public login(user: any): Observable<any> {
    return this.http.post('http://localhost:4000/apiAdae/usr/login/', user);
  }

  public isAuth(): boolean {
    const token = localStorage.getItem("adae");
    if (token !== null && token !== "" && token !== undefined) {
      if (this.jwt.isTokenExpired(token)) {
        Notiflix.Notify.failure('Su sesión ha expirado...');
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}

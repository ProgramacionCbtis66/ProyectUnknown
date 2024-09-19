import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as Notiflix from 'notiflix';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private ruta = environment.HTTPS;
  private usr = environment.autorization;
  public estatus:boolean = true;

  constructor(private http: HttpClient,
     private jwt: JwtHelperService
  ) { }

  private handleError(error: HttpErrorResponse) {
    console.error('Error: ', error);
    const status = error.status;
    console.error(`Status ${status}`);
    return throwError(() => error);
  }


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

  public decodifica(): any {
    return decode(localStorage.getItem("adae"));
  }

  public continuar(): void{
    let tokedecode = this.decodifica();
    tokedecode.exp += 1800;
    let tokecode = this.jwt.decodeToken(tokedecode);
    localStorage.setItem("adae", tokecode);
  }

  public tokeExpired(): boolean{
    const tokenDecode = this.decodifica();
    var tiempo = (tokenDecode.exp - Date.now() / 1000);
    if (tiempo < 0) {
      localStorage.clear();
      return true;
    } else {
      return false;
    }
  }
}

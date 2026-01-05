import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class JuegoPropioService {

  constructor(private http: HttpClient) { 
  };

  obtenerJugadores(): Observable<any>{

    var options = {
      headers: {
        'x-apisports-key': 'ce9ddf3d912e3de05b596383bbeaad2c'
      }
    };

    return this.http.get<any>('https://v3.football.api-sports.io/players/topscorers?season=2023&league=39', options).pipe();

  }

}
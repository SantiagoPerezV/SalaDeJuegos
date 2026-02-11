import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class JuegoPropioService {
  
  year = [2021, 2022, 2023];
  league = [39, 78, 140, 135, 61, 94, 128];

  constructor(private http: HttpClient) { 
  };

  obtenerJugadores(): Observable<any>{

    var options = {
      headers: {
        'x-apisports-key': 'ce9ddf3d912e3de05b596383bbeaad2c'
      }
    };

    const anio = this.year[Math.floor(Math.random() * this.year.length)];
    const league = this.league[Math.floor(Math.random() * this.league.length)];
    
    console.log(anio);
    return this.http.get<any>(`https://v3.football.api-sports.io/players/topscorers?season=${anio}&league=${league}`, options).pipe();


  }

}
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs';

import { Injectable } from '@angular/core';


import { Pregunta } from '../../lib/interfaces';

@Injectable({
    providedIn: 'root'
})

export class PreguntadosService{
    private apiUrl = "https://corsproxy.io/?https://questionados-as-integrador-production.up.railway.app/preguntas/aleatoria";
    private questionJsonPath = '../../../assets/trivia-question.json';
    private cacheQuestions: Pregunta[] = [];
    private idPreguntasUsadas: Set<number> = new Set<number>();

    constructor(private http: HttpClient){
        this.cargarPreguntasDelJson().subscribe(preguntas => {
            this.cacheQuestions = preguntas;
            console.log(this.cacheQuestions.length + ' preguntas cargadas del JSON')
        });
    }

    //Carga las preguntas desde la API
    obtenerPreguntaRandom(): Observable<any> {
        return this.http.get<any>(this.apiUrl).pipe(
            catchError(error => {
                console.error('Error al cargar preguntas de la API: ', error);
                return of([this.cargarPreguntasDelJson()]);
            })
        );
    }

    cargarPreguntasDelJson(): Observable<Pregunta[]> {
        return this.http.get<Pregunta[]>(this.questionJsonPath).pipe(
            catchError(error =>{
                console.error('Error al cargar preguntas del JSON: ', error);
                return of([]);
            })
        );
    }

}
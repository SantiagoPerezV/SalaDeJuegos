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
    private questionJsonPath = 'assets/trivia-questions.json';
    private cacheQuestions: Pregunta[] = [];
    private idPreguntasUsadas: Set<number> = new Set<number>();

    constructor(private http: HttpClient){
        this.cargarPreguntasDelJson().subscribe(preguntas => {
            this.cacheQuestions = preguntas;
        });
    }

    //Carga las preguntas desde la API
    obtenerPreguntaRandom(): Observable<any> {
        return this.http.get<any>(this.apiUrl).pipe(
            catchError(error => {
                console.error('Error al cargar preguntas de la API: ', error);
                return of(this.obtenerPregunta());
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

    obtenerPregunta(): Pregunta{
        //Verificaciones

        //Si se usasron todas las preguntas, reinicia el conjunto
        if(this.idPreguntasUsadas.size >= this.cacheQuestions.length){
            this.idPreguntasUsadas.clear();
        }

        //Encuentra las preguntas que no se utilizaron
        let preguntasDisponibles = this.cacheQuestions.filter(q => !this.idPreguntasUsadas.has(q.id));

        //Si estas preguntas no existen, recarga todas las cacheQuestion
        if(preguntasDisponibles.length === 0){
            preguntasDisponibles = this.cacheQuestions;
        }

        //Obtengo una pregunta de la lista disponible
        const randomIndex = Math.floor(Math.random() * preguntasDisponibles.length);
        const preguntaSeleccionada = preguntasDisponibles[randomIndex];

        //Agrego el id de la misma a laa lista de preguntas usadas.
        this.idPreguntasUsadas.add(preguntaSeleccionada.id);

        return preguntaSeleccionada

    }

}
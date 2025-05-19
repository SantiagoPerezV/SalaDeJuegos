import { NgClass, NgIf, NgFor, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef} from '@angular/core';

import { PreguntadosService } from '../../services/preguntadosServices/preguntados.service';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ResultadosService } from '../../services/resultadosServices/resultados.service';
import { Pregunta, EstadoPreguntados } from '../../lib/interfaces';
import { RefreshService } from '../../services/refreshServices/refresh.service';

import { gsap } from 'gsap';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, NgClass, NgIf, NgFor],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css'
})

export class PreguntadosComponent implements OnInit, AfterViewInit{

  estado: EstadoPreguntados = this.iniciarEstado();
  maximoPreguntas: number = 10;
  loading: boolean = false;

  esta_logueado: boolean = false;
  
  //COMPRUEBO QUE ESTÉ CORRIENDO EN NAVEGADOR
  private isBrowser: boolean = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private servicioPreguntados: PreguntadosService, private refreshService: RefreshService,   private cdr: ChangeDetectorRef, private resultados: ResultadosService  ){
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        console.log('Sesión activa', JSON.parse(usuario));
        this.esta_logueado = true;
        this.iniciarJuego();
      }
    }
  };

  //Animacion
  //Obtengo el boton
  @ViewChild('preguntaContainer') preguntaContainer!:ElementRef;

  ngAfterViewInit(): void {
    if(this.preguntaContainer){
      this.animarPregunta();
    }
  }
  
  animarPregunta(): void {
    if (this.preguntaContainer) {
      gsap.from(this.preguntaContainer.nativeElement, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
      });
    }
  }

  private iniciarEstado(): EstadoPreguntados {
    return {
      preguntaActual: null,
      respuestaEntrante: null,
      feedback: null,
      esCorrecto: false,
      score: 0,
      preguntasRespondidas: 0,
      respuestasCorrectas: 0,
      juegoTerminado: false,
    }
  }

  iniciarJuego(): void {
    this.estado = this.iniciarEstado();
    this.refreshService.refreshComponent('preguntados');
    this.cargarSiguientePregunta();
  }

  cargarSiguientePregunta(){
    //Si ya se respondieron todas las preguntas, termino el juego
    if (this.estado.preguntasRespondidas >= this.maximoPreguntas){
      this.terminarJuego();
      return;
    }

    this.estado.feedback = null;
    this.estado.respuestaEntrante = null;
    this.loading = true;

    this.servicioPreguntados.obtenerPreguntaRandom().subscribe({
      next: (p: any) => {
        try {
          this.estado.preguntaActual = {
            id:p.id,
            pregunta:p.pregunta,
            categoria: typeof p.categoria === 'object' ? p.categoria.nombre : p.categoria,
            opciones: Array.isArray(p.opciones) ?
              p.opciones.slice(0, 4) :
              ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'],
            respuestaCorrecta: p.respuestaCorrecta
          };
          console.log('Pregunta cargada: ', this.estado.preguntaActual)
        } catch (error) {
          console.error('Error al procesar la pregunta: ', error);
        }
        this.loading = false;

        this.cdr.detectChanges();

        setTimeout(() => this.animarPregunta(), 0);

      },
      error: (error) => {
        console.error('Error al cargar la pregunta', error);
      }
    })

  }

  async terminarJuego(): Promise<void> {
    if (this.estado.juegoTerminado) return;

    this.estado.juegoTerminado = true;
    this.estado.feedback = 'Juego terminado. Puntaje final: ' + this.estado.score + '. Respuestas correctas: ' + this.estado.respuestasCorrectas + ' / ' + this.maximoPreguntas;

    this.resultadoGuardado = false;

    await this.guardarScore();
  }

  //Funcion para obtener la respuesta del usuario
  seleccionarRespuesta(option: string): void{
    if (this.estado.respuestaEntrante || !this.estado.preguntaActual) return;

    this.estado.respuestaEntrante = option;
    this.estado.esCorrecto = option === this.estado.preguntaActual.respuestaCorrecta;
    this.estado.feedback = this.estado.esCorrecto ? 'Respuesta correcta' : 'Respuesta incorrecta. La respuesta correcta es: ' + this.estado.preguntaActual.respuestaCorrecta;

    //Actualizar estadisticaas
    this.estado.preguntasRespondidas++;
    if (this.estado.esCorrecto){
      this.estado.respuestasCorrectas++;
      this.estado.score += 100;
    }

    //Si es la ultima pregunta, termina el juego
    if(this.estado.preguntasRespondidas >= this.maximoPreguntas) {
      //Evito llamadas duplicadas a endGame
      if(!this.estado.juegoTerminado) {
        setTimeout(() => this.terminarJuego(), 1500);
      }
    }

  }

  private resultadoGuardado: boolean = false;

  async guardarScore(): Promise<void>{
    if(this.resultadoGuardado) return;

    const usuario = localStorage.getItem('usuario');
    let user: any;
    if (usuario) {
      user = JSON.parse(usuario);
    }

    try{
      if(user){
        await this.resultados.guardarResultados({
          user_id: user.id,
          game_type: 'preguntados',
          score: this.estado.score,
          details:{
            preguntasRespondidas: this.estado.preguntasRespondidas,
            respuestasCorrectas: this.estado.respuestasCorrectas,
            maximoPreguntas: this.maximoPreguntas
          }
        });
      }
      this.resultadoGuardado = true;
      console.log('Datos guardados correctamente');
    } catch(error){
      console.log('Error al guardar los datos: ', error);
    }

  }


}

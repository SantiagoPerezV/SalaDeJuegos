import { isPlatformBrowser, NgIf } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { JuegoPropioService } from '../../services/juegoPropioServices/juego-propio.service';
import { ResultadosService } from '../../services/resultadosServices/resultados.service';

import { Jugador } from '../../lib/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-juego-propio',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, NgIf],
  templateUrl: './juego-propio.component.html',
  styleUrl: './juego-propio.component.css'
})
export class JuegoPropioComponent implements OnInit{

  esta_logueado: boolean = false;

  
  //Variables del juegos
  lista_jugadores: Jugador[] = [];
  private idJugadoresUsados: Set<number> = new Set<number>();
  jugadorActual!: Jugador;
  jugadorSiguiente!: Jugador;
  juegoTerminado: boolean = false;
  
  liga: string = '';
  foto_liga: string = '';
  ano: number = 0;

  score: number = 0;
  mensajeResultado: string = ""
  resultadoGuardado = false;

  nombre_usuario: any;
  
  //COMPRUEBO QUE ESTÉ CORRIENDO EN NAVEGADOR
  private isBrowser: boolean = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private servicioJuego: JuegoPropioService, private resultados: ResultadosService){
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.cargarJugadores();
  }
  
  ngOnInit() {
    if (this.isBrowser) {
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        const user = JSON.parse(usuario)
        console.log('Sesión activa', user);
        this.nombre_usuario = user.usuario;
        this.esta_logueado = true;
      }
    }
    
  };

  async cargarJugadores(): Promise<void> {

    this.servicioJuego.obtenerJugadores().subscribe({
      next: async (data) => {
        for(let i = 0; i < data.response.length; i++){
          let jugadorActual = data.response[i];
          this.lista_jugadores.push({
            id: i,
            nombre: jugadorActual.player.name,
            foto: jugadorActual.player.photo,
            club: jugadorActual.statistics[0].team.name,
            club_foto: jugadorActual.statistics[0].team.logo,
            goles: jugadorActual.statistics[0].goals.total
          });
        }

        this.jugadorSiguiente = await this.obtenerJugador();
        this.jugadorActual = await this.obtenerJugador();

      },
      error: (err) => {
        console.error('Error API:', err);
      }
    });

  }

  //Función: Mover jugadorSiguiente a jugadorActual, cargar nuevo jugadorSiguiente. Verifica: si hay algun jugadorActual
  async obtenerJugador(): Promise<Jugador> {

    if(this.lista_jugadores.length <= this.idJugadoresUsados.size){

      this.terminarJuego("¡Felicidades!. Has adivinado todos los goleadores")

    }

    //Encuentra los jugadores que no se utilizaron. En la lista_jugadores filtro que los jugadores no contengan id de la lista de usados
    let jugadoresDisponibles = this.lista_jugadores.filter(player => !this.idJugadoresUsados.has(player.id));

    //Obtengo un jugador random de la nueva lista de jugadoresDisponibles
    const randomIndex = Math.floor(Math.random() * jugadoresDisponibles.length);
    const nuevoJugador = jugadoresDisponibles[randomIndex];
    
    //Agrego el jugador a usados
    this.idJugadoresUsados.add(nuevoJugador.id);

    return nuevoJugador;
  }

  async Adivinar(opcion: '+' | '-') {

    const esCorrecto =
      (opcion === '+' && this.jugadorSiguiente.goles > this.jugadorActual.goles) ||
      (opcion === '-' && this.jugadorSiguiente.goles < this.jugadorActual.goles) ||
      (this.jugadorSiguiente.goles === this.jugadorActual.goles);
    
    if(esCorrecto){

      this.score += 200;
      this.jugadorActual = this.jugadorSiguiente;
      this.jugadorSiguiente = await this.obtenerJugador();
      this.mensajeResultado = "¡Correcto!";

    }else{
      await this.terminarJuego("¡Perdiste!")
    }
    
  }
  
  async terminarJuego(mensaje: string) {
    
    this.juegoTerminado = true;
    this.mensajeResultado = mensaje;
    this.resultadoGuardado = false;
    await this.guardarResultado();

  }

  async guardarResultado(): Promise<void>{
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
          game_type: 'juego-propio',
          score: this.score,
          details:{
            jugadoresCorrectos: this.score / 200
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

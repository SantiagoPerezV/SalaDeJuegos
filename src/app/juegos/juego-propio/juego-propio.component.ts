import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { JuegoPropioService } from '../../services/juegoPropioServices/juego-propio.service';

import { Jugador } from '../../lib/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-juego-propio',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
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
  año: number = 0;

  score: number = 0;
  
  //COMPRUEBO QUE ESTÉ CORRIENDO EN NAVEGADOR
  private isBrowser: boolean = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private servicioJuego: JuegoPropioService){
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  
  ngOnInit() {
    if (this.isBrowser) {
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        console.log('Sesión activa', JSON.parse(usuario));
        this.esta_logueado = true;
      }
    }
    
    this.cargarJugadores();

  };

  cargarJugadores(): void {

    this.servicioJuego.obtenerJugadores().subscribe({
      next: (data) => {
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

        this.jugadorSiguiente = this.obtenerJugador();
        this.jugadorActual = this.obtenerJugador();

      },
      error: (err) => {
        console.error('Error API:', err);
      }
    });

  }

  //Función: Mover jugadorSiguiente a jugadorActual, cargar nuevo jugadorSiguiente. Verifica: si hay algun jugadorActual
  obtenerJugador(): Jugador {

    //Encuentra los jugadores que no se utilizaron. En la lista_jugadores filtro que los jugadores no contengan id de la lista de usados
    let jugadoresDisponibles = this.lista_jugadores.filter(player => !this.idJugadoresUsados.has(player.id));

    //Obtengo un jugador random de la nueva lista de jugadoresDisponibles
    const randomIndex = Math.floor(Math.random() * jugadoresDisponibles.length);
    const nuevoJugador = jugadoresDisponibles[randomIndex];
    
    //Agrego el jugador a usados
    this.idJugadoresUsados.add(nuevoJugador.id);

    return nuevoJugador;
  }

}

import { Component, OnInit, PLATFORM_ID, Inject, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

import { RouterLink } from '@angular/router';
import { reduce } from 'rxjs';
import { PropertyRead } from '@angular/compiler';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent implements OnInit{

  esta_logueado: boolean = false;

  //EXPORTO EN VARIABLES CADA CARTA
  juegos = [
    { id: '1',imagen: '/assets/ahorcado.png', titulo: 'Ahorcado', link: this.esta_logueado ? '/login' : '/ahorcado' },
    { id: '2',imagen: '/assets/mayor_o_menor.jpg', titulo: 'Mayor o menor', link: this.esta_logueado ? '/login' : '/mayor-o-menor' },
    { id: '3',imagen: '/assets/preguntados.jpg', titulo: 'Preguntados', link: this.esta_logueado ? '/login' : '/preguntados' },
    { id: '4',imagen: '/assets/proximamente.jpg', titulo: 'Próximamente', link: this.esta_logueado ? '/login': '/juego-propio' }
  ];

  
  //COMPRUEBO QUE ESTÉ CORRIENDO EN NAVEGADOR
  private isBrowser: boolean = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object){
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
  };

  //Lista para cambiar estilos de cada descripcion de los juegos
  descripcion: { [key: string]: { [key: string]: string } } = {
    '1': {},
    '2': {},
    '3': {},
    '4': {},
  };

  //Lista para cambiar estilos de cada imagen de los juegos
  imagen: { [key: string]: { [key: string]: string } } = {
    '1': {},
    '2': {},
    '3': {},
    '4': {},
  };
  
  AnimacionCartasIn(id: string) {
      this.descripcion[id] = {
        display: 'block',
      };

      this.imagen[id] = {
        opacity:'0.5',
        transform:'scale(1.25)',
        filter:'brightness(90%) blur(1px)',
      }
  };

  AnimacionCartasOut(id: string) {
    this.descripcion[id] = {
      display: 'none',
    };

    this.imagen[id] = {
      opacity:'1',
    }
};
  
}

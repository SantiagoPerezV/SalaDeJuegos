import { Component, OnInit, PLATFORM_ID, Inject, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

const ahorcado: string = '';
const mayor_o_menor: string = '';
const preguntados: string = '';
const juego_propio: string = '';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent implements OnInit{

  //EXPORTO EN VARIABLES CADA CARTA
  ahorcado = cartaJuego('/assets/ahorcado.png', 'Ahorcado', '/ahorcado');
  mayor_o_menor = cartaJuego('/assets/mayor_o_menor.jpg', 'Mayor o menor', '/mayor-o-menor');
  preguntados = cartaJuego('/assets/preguntados.jpg', 'Preguntados', '/preguntados');
  juego_propio = cartaJuego('/assets/proximamente.jpg', 'Proximamente', '/juego-propio');
  
  //COMPRUEBO QUE ESTÉ CORRIENDO EN NAVEGADOR
  private isBrowser: boolean = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object){
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  @ViewChild('.descripcion') descripcion!: HTMLDivElement;

  ngOnInit() {
    if (this.isBrowser) {
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        console.log('Sesión activa', JSON.parse(usuario));
      }
    }
  }

  AnimacionCartas(){
    this.descripcion.style.display = 'block';
  }

}



function cartaJuego(imagen: string, titulo: string, link: string): string {
  return `
    <div (mouseover)="AnimacionCartas()" class="carta-juego">
      <img src="${imagen}" alt="img-${titulo}">
      <div class="descripcion">
        <h2>${titulo}</h2>
        <a href="${link}">Entrar</a>
      </div>
    </div>
  `;
}
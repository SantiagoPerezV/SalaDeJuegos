import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FooterComponent } from '../../footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-mayor-o-menor',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './mayor-o-menor.component.html',
  styleUrl: './mayor-o-menor.component.css'
})

export class MayorOMenorComponent implements OnInit{

  esta_logueado: boolean = false;
  
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

  numero_a_adivinar: number = (Math.random() * 100);

  numero!: number;

  mensaje: string = 'Adivina el primer número'

  intentos: number = 0;

  adivinado: boolean = false;

  mensaje_final = `Adivinaste el número en ${this.intentos} intentos!`;

  NumeroIngresado(){
    this.intentos += 1;

    console.log(this.numero_a_adivinar);

    let numero_a_adivinar = Math.round(this.numero_a_adivinar);
    console.log(numero_a_adivinar);

    if(this.numero == numero_a_adivinar){
      this.adivinado = true;
    }else{
      if(this.numero < numero_a_adivinar){
        this.mensaje = 'El número es mayor'
      }else{
        this.mensaje = 'El número es menor'
      }
    }
  }

}

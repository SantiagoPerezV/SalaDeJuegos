import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css'
})
export class PreguntadosComponent implements OnInit{

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

}

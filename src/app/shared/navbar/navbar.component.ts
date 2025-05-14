import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit {
  private isBrowser: boolean = false;
  usuario_encontrado: boolean = false;
  nombre_usuario: string = ''

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object){
    this.isBrowser = isPlatformBrowser(this.platformId);
  };

  ngOnInit(): void{
    if(this.isBrowser) {
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        const sesion = JSON.parse(usuario);
        this.nombre_usuario = sesion.usuario;
        this.usuario_encontrado = true;
      }
    }
  }

  CerrarSesion(): void{
    if (this.isBrowser){
      localStorage.clear();
      this.router.navigate(['login']);
    }
  }
}

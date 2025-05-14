import { FormsModule } from '@angular/forms';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Subscription } from 'rxjs';

import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { Usuario } from '../lib/interfaces';
import { SupabaseService } from '../services/supabase.service';
import { Router } from '@angular/router';

//Estar logueado si o si al querer entrar en un juego

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports:[NavbarComponent, FooterComponent, FormsModule],
  standalone: true
})

export class LoginComponent implements OnInit {
  usuarios: Usuario[] = [];
  id: string = '';
  usuario: string = '';
  contrasena: string = '';

  private isBrowser: boolean = false;
  private usuariosSubscription!: Subscription;

  constructor(private supabase: SupabaseService, private router: Router,@Inject(PLATFORM_ID) private platformId: Object){
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit(): Promise<void>{

    this.usuariosSubscription = this.supabase.usuarios$.subscribe({
      //guardamos la lista de objetos Usuario en la variable local this.usuarios.
      next: (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
      },
      error:(error:any) => {
        console.error('Error al cargar los usuarios: ', error);
      }
    }) 
  }

  async IniciarSesion(){
    const usuarioEncontrado = this.usuarios.find(
      user => user.usuario === this.usuario.trim() && user.contrasena === this.contrasena.trim()
    );
  
    if (usuarioEncontrado) {
      if (this.isBrowser) {
        localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
      }
      this.router.navigate(['/']);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  }

}

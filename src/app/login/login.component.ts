import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { SupabaseClient } from '@supabase/supabase-js';

//Estar logueado si o si al querer entrar en un juego
//Guardar inicio de sesión mientras que está en la página
//Separar login  registro de menu de navegación principal, ponerlo más a la derecha.
//Una vez registrado o iniciado sesion, sacar esta parte del menú e indicar quien es o algo asi y un botón de cerrar sesión

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports:[NavbarComponent, FooterComponent, FormsModule],
  standalone: true
})

export class LoginComponent {
  
  id: string = '';
  usuario: string = '';
  contrasena: string = '';

  constructor(private supabase: SupabaseClient){

  }

}

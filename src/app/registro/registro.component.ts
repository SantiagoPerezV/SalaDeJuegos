import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { Subscription } from 'rxjs';

import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { Usuario } from '../lib/interfaces';
import { SupabaseService } from '../supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  standalone: true,
})

/**
 * La clase del componente implementa:
 * - OnInit: Para inicializar cosas cuando el componente se crea
 * - OnDestroy: Para limpiar cuando el componente se destruye
 */
export class RegistroComponent implements OnInit{
  usuarios: Usuario[] = [];

  id: string = '';
  mail: string = '';
  usuario: string = '';
  contrasena: string = '';
  contrasena_repetida: string = '';

  /**
   * Nos dice si estamos ejecutando en el navegador o en el servidor.
   * Esto es importante porque algunas cosas (como localStorage)
   * solo funcionan en el navegador.
  */
  isBrowser: boolean = false;

  /**
   * Guarda nuestra suscripción a los cambios en los usuarios.
   * Es importante guardarla para poder cancelarla cuando
   * el componente se destruye y evitar pérdidas de memoria.
   */
  private usuariosSubscription!: Subscription;

  /**
   * El constructor se llama cuando Angular crea el componente.
   * Aquí recibimos los servicios que necesitamos (inyección de dependencias).
  */
  constructor(private supabase: SupabaseService, private router: Router,@Inject(PLATFORM_ID) private platformId: Object){
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * ngOnInit se llama automáticamente cuando el componente está listo.
   * Es el lugar ideal para inicializar datos y suscribirnos a eventos.
   * 
   * En este caso:
   * 1. Verificamos si estamos en el navegador
   * 2. Nos suscribimos a los cambios en los usuarios
   * 3. Manejamos errores y éxitos
  */
  ngOnInit(): void{

    this.usuariosSubscription = this.supabase.usuarios$.subscribe({
      //Cuando recibimos nuevas tareas, guardamos la lista de objetos Usuario en la variable local this.usuarios.
      next: (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
      },
      error:(error:any) => {
        console.error('Error al cargar los usuarios: ', error);
      }
    }) 
  }

  /**
   * ngOnDestroy se llama automáticamente cuando el componente va a ser destruido.
   * Es el lugar ideal para limpiar recursos y evitar pérdidas de memoria.
   * 
   * En este caso, cancelamos nuestra suscripción a las tareas para evitar que
   * sigamos recibiendo actualizaciones cuando el componente ya no existe.
   * 
   * El operador ?. (optional chaining) asegura que solo llamemos a unsubscribe
   * si la suscripción existe.
  */
  // ngOnDestroy() {
  //   this.usuariosSubscription?.unsubscribe();
  // }

  private usuarioExiste (): boolean{
    let existe = false;

    if(this.usuarios.some( usuario => usuario.mail.toLowerCase().trim() === this.mail.toLowerCase().trim())){
      existe = true;
      alert('El mail ya existe')
    }

    if(this.usuarios.some( usuario => usuario.usuario.toLowerCase().trim() === this.usuario.toLowerCase().trim())){
      existe = true;
      alert('El usuario ya existe')
    }

    if(this.usuarios.some( usuario => usuario.contrasena.toLowerCase().trim() === this.contrasena.toLowerCase().trim())){
      existe = true;
      alert('La contraseña ya existe')
    }

    return existe;
  }

  private limpiezaDatos(): boolean{
    let usuario_limpio = !(this.usuarioExiste());

    //Verificar si las contraseñas son iguales
    if(this.contrasena != this.contrasena_repetida){
      alert('Las contraseñas son distintas');
      usuario_limpio = false;
    }
  
    //Verificar que no esté vacía
    if (this.mail.trim() == '' || this.usuario.trim() == '' || this.contrasena.trim() == ''){
      alert('Completa todos los datos');
      usuario_limpio = false;
    }
  
    //Verificar que el mail tenga @ y .com
    if (!(this.mail.includes('@')) || !(this.mail.includes('.com'))){
      alert('El mail debe contener @ y .com');
      usuario_limpio = false;
    }

    //Verificar que la contraseña tenga más de 8 caractéres
    if(this.contrasena.length < 8){
      alert('La contraseña debe tener más de 8 caractéres')
      usuario_limpio = false;
    }
    
    return usuario_limpio;
  }

  async RegistrarUsuario(){
    const usuario_limpio = this.limpiezaDatos();

    if(usuario_limpio){

      const mail_nuevo = this.mail.trim();
      const usuario_nuevo = this.usuario.trim();
      const contrasena_nuevo = this.contrasena.trim();

      try{
        await this.supabase.AgregarUsuario(mail_nuevo, usuario_nuevo, contrasena_nuevo);
        this.id = await this.supabase.ObtenerIdPorMail(mail_nuevo);
        console.log(this.id);
        this.router.navigate(['/']);

      }catch(error){
        console.error('Error al agregar usuario', error);
      }
    }
  }
}
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { Subscription } from 'rxjs';
import { SUPABASE_CONFIG } from '../lib/constants';
import { Database, Usuario } from '../lib/interfaces';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})

export class SupabaseService {
  private supabase!: SupabaseClient<Database>; //La ! al final significa que la variable se inicializará después de la creación de la clase (en el constructor).
  
  private usuariosSubscription!: Subscription;

  /**
  * BehaviorSubject es como una "caja" especial que:
  * 1. Guarda el valor actual de los usuarios
  * 2. Notifica a todos los interesados cuando este valor cambia
  * 3. Puede dar el último valor a los nuevos suscriptores
  * 
  * Es como un canal de noticias que siempre tiene la última noticia disponible.
  */
  private usuarios = new BehaviorSubject<Usuario[]>([]);

  /**
   * Versión pública de usuarios que otros componentes pueden usar para recibir
   * actualizaciones. Es como la "transmisión en vivo" de nuestras tareas.
   * 
   * Los componentes pueden suscribirse así:
   * this.supabaseService.tasks$.subscribe(tasks => {
   *   // Hacer algo con los usuarios actualizados
   * });
   */
  usuarios$ = this.usuarios.asObservable();

  private iniciar = false; //Bandera para verificar que la conexión es correcta

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { //Insertamos el platform id para identificar si estamos en un navegador o en un servidor
    if(isPlatformBrowser(this.platformId)){ //Importa que ingrese por navegador
      try {
        // Creamos el cliente de Supabase con nuestra configuración
        this.supabase = createClient<Database>(
         SUPABASE_CONFIG.url,
         SUPABASE_CONFIG.key,
         SUPABASE_CONFIG.options,
         );

         //Iniciamos la conexión y cargamos los datos
         this.inicializado();
      
      } catch (error) {
        this.usuarios.error(error); //Captura el error y lo muestra por pantalla
      }
    }
  };

  /**
   * Método privado que configura todo lo necesario para empezar a usar Supabase.
   * Se ejecuta automáticamente cuando se crea el servicio.
   * 
   * Es como el "ritual de inicio" de nuestra conexión con la base de datos:
   * 1. Verifica que no hayamos inicializado antes
   * 2. Comprueba que podemos conectar con Supabase
   * 3. Crea las tablas si no existen
   * 4. Carga las tareas iniciales
  */

  private async inicializado(){
    if(this.iniciar){
      return;
    }

    try {
      const { data, error } = await this.supabase.from('Usuarios').select('*');

      if(error){
        throw error;
      }

      await this.SeleccionarTodosUsuarios();
      this.iniciar = true;

    } catch (error) {
      this.usuarios.error(error);
    }
  }

  async SeleccionarTodosUsuarios(){
    try {
      
      // Hacemos la consulta a Supabase
      const response = await this.supabase.from('Usuarios').select('*').order('usuario');
  
      if (response.error){
        throw response.error;
      }
  
      // Actualizamos el BehaviorSubject con las nuevas tareas
      // Si no hay tareas, usamos un array vacío
      const usuarios = response.data || [];
      this.usuarios.next(usuarios); //el next hace que la lista de objetos de behavior, se actualice a partir del ultimo elemento de la lista.
      
      
    } catch (error) {

      this.usuarios.error(error);

    }
  }

  /**
   * 
   * Ejemplo de uso:
   * try {
   *   await supabaseService.Agregarusuario('santirojo06@gmail.com', santi123, 123);
   *   // El usuario se creó exitosamente
   * } catch (error) {
   *   // Manejar el error
   * }
   */

  async AgregarUsuario(mail:string, usuario:string, contrasena:string): Promise<void>{
    const {data, error} = await this.supabase.from('Usuarios').insert([{mail, usuario, contrasena}]);
    if (error){
      throw error;
    } 
  }

  async ObtenerIdPorMail(mail:string): Promise<string>{
    const {data, error} = await this.supabase.from('Usuarios').select('id').eq('mail', mail);
    if(error){throw error;};
    return data[0].id; //Devuelve un array, que dentro de corchetes tiene los valores que devuelve.
  }
}

 
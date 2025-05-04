import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PostgrestQueryBuilder } from "@supabase/postgrest-js";

@Injectable({
  providedIn: 'root',
})

export class SupabaseService {
  private supabaseurl = 'postgresql://postgres:#Ageofempires05@db.khtgknelsrxicavmejpp.supabase.co:5432/postgres';
  private supabasekey = 'id';
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(this.supabaseurl, this.supabasekey);
  };

  async SeleccionarTodosUsuarios(){
    const {data, error} = await this.supabase.from('Usuarios').select('*').order('usuario');
    if (error) throw error;
    return data;
  }

  async AgregarUsuario(mail:string, usuario:string, contrasena:string){
    const {data, error} = await this.supabase.from('Usuarios').insert([{mail, usuario, contrasena}]);
    if (error) throw error;
    return data;
  }

  async ActualizarUsuario(id: string, mail:string, usuario:string, contrasena:string){
    const {data, error} = await this.supabase.from('Usuarios').update([{mail, usuario, contrasena}]).eq('id', id);
    if (error) throw error;
    return data;
  }

  async EliminarUsuario(id: string){
    const {data, error} = await this.supabase.from('Usuarios').delete().eq('id', id);
    if (error) throw error;
    return data;
  }

}

 
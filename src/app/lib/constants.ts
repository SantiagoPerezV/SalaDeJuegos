import { SupabaseClientOptions } from "@supabase/supabase-js";

//Estos dos valores se encuentrar en el apartado de configuración, Data API y API Keys (la public).
export const SUPABASE_CONFIG = {
    url: 'https://uimrarmwawlcxzocrhxc.supabase.co',
    key: 'sb_publishable_urj9nB-5IP60gcpDF4oImg_vgnzmSma',

    options: { //Opciones adicionales para saber como funciona la conexion con supabase
        db:  {
            schema: 'public' //Para que se pueda acceder sin problema
        },

        auth: {
            autoRefreshToken: true, //La aplicación renueva el inicio para que no se desloguee el usuario. Pasa el tiempo y no se desloguea.
            persistSession: true, //La sesión de usuario se guarda cuando recargue la página.
            detectSessionInUtl: true, //La aplicación busca en la url si hay un id en el path. Esto sirve para cuando se redirija al home luego de iniciar sesión, guardemos el id en el path y ya mantenga la sesión iniciada.
        },

        global: {
            headers: {
                'Content-Type': 'application/json', //Que todo lo que devuelva sea de tipo json                
            }
        }
    } as SupabaseClientOptions<'public'> //Garantiza que SupabaseConfig sea un objeto público
}
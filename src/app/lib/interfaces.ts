export type UUID = string; //tipo de string unico que identifica las columnas

export interface Usuario {
    id: UUID;
    mail: string;
    usuario: string;
    contrasena: string;
}

//Cuestiones a tener en cuenta para la manipulación de la misma
export interface Database{
    public: {
        tables: {
            Usuarios:{
                Row: Usuario;
                Insert: Omit<Usuario, 'id'>; //Indico que en el insert, puede omitir el id, ya que lo cargará solo el supabase
                Update: Partial<Omit<Usuario, 'id'>> //Indico que en el update, omita el id porque no lo puede cambiar.
            };
        };
    };
}

export interface ChatMessage{
    id: number,
    content: string,
    user_id: string,
    user_name: string
    created_at: string,
}


export interface Carta {
    nombre:string,
    valor:number,
    getImagen(): string,
};

export interface Pregunta{
    id: number,
    pregunta: string,
    categoria: {nombre:string},
    opciones: string[], 
    respuestaCorrecta: string
}

export interface EstadoPreguntados{
    preguntaActual: Pregunta | null;
    respuestaEntrante: string | null;
    feedback: string | null;
    esCorrecto: boolean;
    score: number;
    preguntasRespondidas: number;
    respuestasCorrectas: number;
    juegoTerminado: boolean;
}
import { Injectable, Inject, PLATFORM_ID, OnInit } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { SupabaseService } from "../supabase.service";
import { RealtimeChannel } from "@supabase/supabase-js";;
import { ChatMessage } from "../../lib/interfaces";

@Injectable({
    providedIn: 'root'
})

export class ChatService {
  private channel: RealtimeChannel | null = null;
  private isBrowser: boolean = false;

  constructor(private supabaseService: SupabaseService, @Inject(PLATFORM_ID) private platformId: Object){
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async obtenerMensajes(): Promise<ChatMessage[]> {
    if (!this.isBrowser) {
      console.log(`[ChatService] No es browser, no obtiene mensajes`);
      return [];
    }
  
    if (!this.supabaseService.supabase) {
      console.error('[ChatService] Supabase no está inicializado');
      return [];
    }
  
    const { data, error } = await this.supabaseService.supabase
      .from('Chat')
      .select('*')
      .order('created_at', { ascending: true });
  
    if (error) {
      console.error('[ChatService] Error al obtener mensajes:', error);
      throw error;
    }
  
    console.log('[ChatService] Mensajes recibidos desde Supabase:', data);
    return data as ChatMessage[];
  }

  suscribirseAMensajes(callback: (message:ChatMessage) => void): void {
    if(!this.isBrowser) return;

    this.channel = this.supabaseService.supabase
    .channel('public:Chat')
    .on('postgres_changes',
        { event: '*', schema: 'public', table: 'Chat'},
        payload => {
            if (payload.eventType === 'INSERT') {
                callback(payload.new as ChatMessage);
            }
        }
    )
    .subscribe();
  }

  desuscribirseDeMensajes(): void{
    if(!this.isBrowser) return;
    this.channel?.unsubscribe();
  }

  async enviarMensaje(content: string, userId: number, userName: string): Promise<void>{
    if(!this.isBrowser) return;

    const { error } = await this.supabaseService.supabase
      .from('Chat')
      .insert({
          content: content.trim(),
          user_id: userId,
          user_name: userName
      });
    if(error) throw error;
  }

}
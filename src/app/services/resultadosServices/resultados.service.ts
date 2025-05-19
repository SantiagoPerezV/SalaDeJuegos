import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { Resultado } from '../../lib/interfaces';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ResultadosService {

  constructor(private supabaseService:SupabaseService, @Inject(PLATFORM_ID) private platformId: Object) { }

  async guardarResultados(result: Resultado): Promise<void>{
    if(!isPlatformBrowser(this.platformId)) return;
    const { error } = await this.supabaseService.supabase
    .from('Resultados')
    .insert(result);

    if(error) throw error;
  }

  async obtenerResultadosPorJuego(userId: number, gameType?: string): Promise<Resultado[]>{
    let query = this.supabaseService.supabase
    .from('Resultado')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', {ascending: false})

    if(gameType){
      query = query.eq('game_type', gameType);
    }

    const {data, error} = await query;

    if (error) throw error;
    return data || [];
  }

  async obtenerTopScores(gameType: string, limit: number = 10): Promise<any[]> {

    if (!isPlatformBrowser(this.platformId)) return [];
    
    try {
    
      let query = this.supabaseService.supabase
      .from('Resultados')
      .select()
      .eq('game_type', gameType)
      .order('score', { ascending: false })
      .limit(limit * 2); // Obtenemos de más filtrar duplicades
      
      const {data, error} = await query;
      
      if (error) throw error;
          
      const uniquePlayers = (data || []).reduce((acc: any[], curr: any) => {
      
        const existingPlayer = acc.find(p => p.user_id === curr.user_id);
      
        if (!existingPlayer) {
        
          acc.push({
            user_id: curr.user_id,
            username: 'Jugador' + curr.user_id.substring(0, 5), // Nombr
            score: curr.score,
            won: curr.won,
            created_at: curr.created_at
          });
        }
      
        return acc;
      }, []);
      
      try {
      for (const player of uniquePlayers) {
      
        const {data: profileData} = await this.supabaseService.supabase
          .from('Usuarios')
          .select('usuario')
          .eq('id', player.user_id)
          .single();
        
          if (profileData && profileData.usuario) {
          
            player.usuario = profileData.usuario;
          
          } 
        }
      } catch (profileError) {
        console.warn('No se pudieron cargar los perfiles:, profileError');
      }
      
      return uniquePlayers.slice(0, limit);
      
    } catch (error) {
    
      console.error('Error fetching top scores:', error);
      return [];
    
    }
    
  }

}

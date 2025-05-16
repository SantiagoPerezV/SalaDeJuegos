import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { ChatService } from '../services/chatServices/chat.service';
import { ChatMessage } from '../lib/interfaces';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy{

  messages: ChatMessage[] = [];
  newMessage = '';
  loading = false;
  error = '';
  private isBrowser: boolean;

  constructor( private chatService: ChatService){
    console.log('[ChatComponent] Constructor o ngOnInit iniciado');
    this.isBrowser = isPlatformBrowser(Inject(PLATFORM_ID));
  }

  async ngOnInit() {
    console.log('[ChatComponent] Constructor o ngOnInit iniciado');
    if(this.isBrowser){
      console.log('[ChatComponent] ngOnInit ejecutado');
      await this.cargarMensajes();
      this.suscribirseAMensajes();
      console.log('[ChatComponent] Mensajes cargados:', this.messages);
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser){
      this.chatService.desuscribirseDeMensajes();
    }
  }

  private async cargarMensajes(){
    if (!this.isBrowser) return;

    try {
      this.loading = true;
      const mensajes = await this.chatService.obtenerMensajes();
      console.log('[ChatComponent] Resultado de obtenerMensajes:', mensajes);
      this.messages = mensajes;
    } catch (error: any) {
      this.error = error.message;
      console.error('Error al cargar los mensajes', error);
    } finally {
      this.loading = false;
    }
  }

  private suscribirseAMensajes(){
    if(!this.isBrowser) return;

    this.chatService.suscribirseAMensajes((message) =>{
      this.messages = [...this.messages, message]
      console.log('[ChatComponent] mensajes recibidos:', this.messages);
    })
  }

  async enviarMensaje(){
    if(!this.isBrowser || !this.newMessage.trim()) return;

    try {
      //Verifico que el usuario esté autenticado
      const user = localStorage.getItem('usuario');
      if(!user) throw new Error('Usuario no autenticado');

      //parseo el JSON del localStorage
      const usuario = JSON.parse(user);

      //Envio el mensaje y reinicio el input
      await this.chatService.enviarMensaje(this.newMessage, usuario.id, usuario.usuario);
      this.newMessage = '';

    //Capturo el error
    } catch (error: any) {
      this.error = error.message;
      console.error('Error al enviar mensaje', error);
    }
  }

  formatDia(date: string): string {
    return new Date(date).toLocaleString();
  }

}

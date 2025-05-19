import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { NgClass, CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { ChatService } from '../services/chatServices/chat.service';
import { ChatMessage } from '../lib/interfaces';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, FormsModule, NgClass],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy{

  messages: ChatMessage[] = [];
  newMessage = '';
  loading = false;
  error = '';
  usuario = localStorage.getItem('usuario');
  user!: any;
  
  private isBrowser: boolean;
  
  constructor( private chatService: ChatService){
    this.isBrowser = isPlatformBrowser(Inject(PLATFORM_ID));
  }
  
  async ngOnInit() {
    await this.cargarMensajes();
    this.suscribirseAMensajes();
    if(this.usuario){
      this.user = JSON.parse(this.usuario);
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser){
      this.chatService.desuscribirseDeMensajes();
    }
  }

  async cargarMensajes(){
    try {
      this.loading = true;
      const mensajes = await this.chatService.obtenerMensajes();
      this.messages = mensajes;
    } catch (error: any) {
      this.error = error.message;
      console.error('Error al cargar los mensajes', error);
    } finally {
      this.loading = false;
    }
  }

  suscribirseAMensajes(){
    this.chatService.suscribirseAMensajes((message) =>{
      this.messages = [...this.messages, message]
    })
  }

  async enviarMensaje(){
    if(!this.newMessage.trim()) return;

    try {
      //Verifico que el usuario esté autenticado
      const user = localStorage.getItem('usuario');
      if(!user) throw new Error('Usuario no autenticado');

      //parseo el JSON del localStorage
      const usuario = JSON.parse(user);

      //Envio el mensaje y reinicio el input
      await this.chatService.enviarMensaje(this.newMessage, usuario.id, usuario.usuario);
      this.newMessage = '';
      await this.cargarMensajes();

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

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
  imports: [NavbarComponent, FooterComponent, FormsModule],
  standalone: true,
})


export class RegistroComponent {
  mail: string = '';
  usuario: string = '';
  contrasena: string = '';
  contrasena_repetida: string = '';

  Registrar(){
    alert(this.mail);
    alert(this.usuario);
    alert(this.contrasena);
    alert(this.contrasena_repetida);

    if(this.contrasena != this.contrasena_repetida){
      alert('Las contraseñas son distintas');
    }

    if (this.mail == '' || this.usuario == '' || this.contrasena == '' || this.contrasena_repetida == ''){
      alert('Completa todos los datos');
    }

    if (!(this.mail.includes('@')) || !(this.mail.includes('.com'))){
      alert('El mail debe contener @ y .com');
    }

  }
  
}
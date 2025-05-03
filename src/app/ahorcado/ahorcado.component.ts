import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-ahorcado',
  standalone:true,
  imports: [NavbarComponent, FooterComponent],
  styleUrl: './ahorcado.component.css',
  templateUrl: './ahorcado.component.html'
})
export class AhorcadoComponent {

}

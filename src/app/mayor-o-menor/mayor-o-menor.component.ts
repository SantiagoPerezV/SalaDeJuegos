import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-mayor-o-menor',
  standalone:true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './mayor-o-menor.component.html',
  styleUrl: './mayor-o-menor.component.css'
})
export class MayorOMenorComponent {

}

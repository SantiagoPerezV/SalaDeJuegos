import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

interface Usuario{
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  location: string;
}

@Component({
  selector: 'app-quienes-somos',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './quienes-somos.component.html',
  styleUrl: './quienes-somos.component.css'
})

export class QuienesSomosComponent implements OnInit{ //Implementamos la interfaz onInit
  userData = signal<Usuario | null>(null);

  constructor (private http: HttpClient){}
  
  ngOnInit(){
    this.fetchGitHubData();
  }
  
  fetchGitHubData(){
    this.http.get<Usuario>('https://api.github.com/users/SantiagoPerezV')
    .subscribe({
      next: (data) =>{
        this.userData.set(data);
      },
      error: (error) => {
        console.error('Error fetching Github data: ', error);
      }
    });
  }
}

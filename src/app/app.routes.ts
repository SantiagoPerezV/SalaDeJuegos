import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';
import { authGuard } from './guards/guard-juego.guard';

export const routes: Routes = [

    { //ruta principal que muestra el login con la base de datos,
        path:'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    },

    { //ruta principal que muestra el Registro con la base
        path:'registro', 
        loadComponent: ()=> import('./registro/registro.component').then(m=>m.RegistroComponent),
    },

    {
        path:'', component: HomeComponent
    },

    {
        path:'quienes-somos', component: QuienesSomosComponent
    },

    {
        path:'ahorcado',
        loadComponent: () => import('./juegos/ahorcado/ahorcado.component').then(m => m.AhorcadoComponent),
        canActivate: [authGuard]
    },

    {
        path:'mayor-o-menor',
        loadComponent: () => import('./juegos/mayor-o-menor/mayor-o-menor.component').then(m => m.MayorOMenorComponent),
        canActivate: [authGuard]
    },

    {
        path:'preguntados',
        loadComponent: () => import('./juegos/preguntados/preguntados.component').then(m => m.PreguntadosComponent),
        canActivate: [authGuard]
    },

    {
        path:'juego-propio',
        loadComponent: () => import('./juegos/juego-propio/juego-propio.component').then(m => m.JuegoPropioComponent),
        canActivate: [authGuard]
    },

    {
        path:'chat',
        loadComponent: () => import('./chat/chat.component').then(m => m.ChatComponent),
    }

];

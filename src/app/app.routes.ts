import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';

export const routes: Routes = [

    { //ruta principal que muestra el login con la base de datos,
        path:'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },

    { //ruta principal que muestra el Registro con la base
        path:'registro', loadComponent: ()=> import('./registro/registro.component').then(m=>m.RegistroComponent)
    },

    {
        path:'', component: HomeComponent
    },

    {
        path:'quienes-somos', component: QuienesSomosComponent
    },

    {
        path:'ahorcado',
        loadComponent: () => import('./ahorcado/ahorcado.component').then(m => m.AhorcadoComponent)
    },

    {
        path:'mayor-o-menor',
        loadComponent: () => import('./mayor-o-menor/mayor-o-menor.component').then(m => m.MayorOMenorComponent)
    },

    {
        path:'preguntados',
        loadComponent: () => import('./preguntados/preguntados.component').then(m => m.PreguntadosComponent)
    },

    {
        path:'juego-propio',
        loadComponent: () => import('./juego-propio/juego-propio.component').then(m => m.JuegoPropioComponent)
    }
];

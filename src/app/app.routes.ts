import { Routes } from '@angular/router';
import { RegistroComponent } from './registro/registro.component';
import { HomeComponent } from './home/home.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';
import { AhorcadoComponent } from './ahorcado/ahorcado.component';
import { MayorOMenorComponent } from './mayor-o-menor/mayor-o-menor.component';
import { PreguntadosComponent } from './preguntados/preguntados.component';
import { JuegoPropioComponent } from './juego-propio/juego-propio.component';

export const routes: Routes = [
    {
        path:'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },

    {
        path:'registro', component: RegistroComponent
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

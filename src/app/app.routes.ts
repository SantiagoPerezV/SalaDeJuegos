import { Routes } from '@angular/router';
import { RegistroComponent } from './registro/registro.component';
import { HomeComponent } from './home/home.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';

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
];

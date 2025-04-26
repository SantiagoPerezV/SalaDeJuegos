import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { HomeComponent } from './home/home.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';

export const routes: Routes = [
    {
        path:'login', component: LoginComponent
    },

    {
        path:'', component: RegistroComponent
    },

    {
        path:'home', component: HomeComponent
    },

    {
        path:'quienes-somos', component: QuienesSomosComponent
    },
];

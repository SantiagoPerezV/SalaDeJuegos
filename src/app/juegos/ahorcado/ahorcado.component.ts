import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css'
})


export class AhorcadoComponent implements OnInit{

  //lista de palabras de ahorcado
  private lista_palabras: { [key: string]: string[] } = {
    'Programacion' : [
      'ANGULAR', 'TYPESCRIPT', 'JAVASCRIPT', 'PROGRAMACION', 'DESARROLLO', 'FRONTEND', 'BACKEND', 'FULLSTACK', 'FRAMEWORK', 'COMPONENTE', 'SERVICIO', 'MODULO'
    ],
    'Paises' : [
      'ARGENTINA', 'BRASIL', 'COLOMBIA', 'MEXICO', 'ESPAÑA', 'FRANCIA', 'ALEMANIA', 'ITALIA', 'JAPON', 'AUSTRALIA'
    ],
    'Animales' : [
      'ELEFANTE', 'JIRAFA', 'TIGRE', 'LEON', 'DELFIN', 'BALLENA', 'AGUILA', 'COCODRILO', 'PINGUINO', 'KOALA'
    ],
    'Frutas' : [
      'MANZANA', 'BANANA', 'NARANJA', 'UVA', 'SANDIA', 'MELON', 'FRUTILLA', 'KIWI', 'MANGO', 'DURAZNO'
    ]
  };

  //Variables para obtener cateogía y palabras
  private categorias: string[] = Object.keys(this.lista_palabras);
  categoria_actual? : string ;
  palabra_actual: {caracter: string, esta_adivinado: boolean} [] = [];
  palabra_en_lista: string = ''

  //Contadores de intentos y de palabras que ya entraron en juego
  intentos: number = 0;
  palabras_terminadas: number = 0;
  
  imagen_ahorcado: string = ''
  //score
  score_actual = 1000;
  score_total = 0;


  //Array de teclas
  teclas = 'QWERTYUIOPASDFGHJKLÑZXCVBNM'.split('');
  teclas_incorrectas: string[] = []

  esta_logueado: boolean = false;
  private router!: Router;
  
  //COMPRUEBO QUE ESTÉ CORRIENDO EN NAVEGADOR
  private isBrowser: boolean = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object){
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        console.log('Sesión activa', JSON.parse(usuario));
        this.esta_logueado = true;
        this.iniciarAhorcado();
      }else{
        this.router.navigate(['/']);
      }
    }
  };

  //Funcion para iniciar el juego. Obtengo una categoria y la primera palabra
  iniciarAhorcado(){
    //Obtener categoria
    let indice_random_categoria = Math.floor(Math.random() * this.categorias.length);
    this.categoria_actual = this.categorias[indice_random_categoria];

    //Igualo el score a 0 para que cuando me de una palabra, no sume el mismo
    this.score_actual = 0;

    this.imagen_ahorcado = '../../assets/ahorcado/ahorcado-' + this.intentos + '.png';


    //Obtener palabra
    this.reiniciarPalabra();

  }

  //Funcion de click del teclado para preguntar por una letra.
  enviarLetra(letra:string){

    //Borro la tecla del teclado
    this.teclas.splice(this.teclas.indexOf(letra), 1);

    //Semaforo de si encontró la letra en algun caracter de la palabra
    let bandera_letra_encontrada = false;

    //Recorro la lista de caracteres de la palabra a adivinar
    for(let i = 0; i < this.palabra_actual.length; i++){

      //Si la letra que se esta recorriendo es igual a la entradda
      if(this.palabra_actual[i].caracter == letra){

        //Cambio el elemento de diccionario diciendo que se encontró la letra
        this.palabra_actual[i].esta_adivinado = true;

        //Semaforo verde comprobando que encontró una letra en la palabra
        bandera_letra_encontrada = true

      }
      
    }
    
    if(!bandera_letra_encontrada){ //Si no esta en la palabra actual: agrego la letra en la lista de teclas incorrectas, bajo el score, sumo un intento, actualizo la imagen del ahorcado y pregunto si supero los 7 intentos; si es asi, reinicio la palabra, y le reincio los intentos
  
      this.teclas_incorrectas.push(letra);

      
      this.score_actual -= 140
      this.intentos++;


      this.imagen_ahorcado = '../../assets/ahorcado/ahorcado-' + this.intentos + '.png'
      
      if (this.intentos > 7){
  
        this.score_actual = 0;
        this.reiniciarPalabra();
  
      }

    }else{ //Si encontró la letra esta en la palabra actual, pregunto si ya ganó; si es así, reinicio la palabra
      if(this.comprobarSiGano()){
        this.reiniciarPalabra();
      }
    }

  }

  //Reiniciar la palabra. Borro la palabra que se ha jugado de la lista_palabras, genero un indice del tamaño del largo de elementos de la categoria y luego lo guardo en la variable, guardo el valor de la palabra, guardo esa misma en una variable de tipo array con los caracteres de esa palabra. Reinicio las teclas y el array de teclas incorrectas. Sumo el score total. Reinicio los intentos y el score. Sumo una palabra a palabras terminadas.
  reiniciarPalabra(){

    this.lista_palabras[this.categoria_actual!].splice(this.lista_palabras[this.categoria_actual!].indexOf(this.palabra_en_lista), 1);

    let indice_random_palabra = Math.floor(Math.random() * this.lista_palabras[this.categoria_actual!].length);
    this.palabra_en_lista = this.lista_palabras[this.categoria_actual!][indice_random_palabra]
    let palabra = this.palabra_en_lista.split('');
    this.palabra_actual = palabra.map(caracter => ({caracter: caracter, esta_adivinado: false}));

    this.teclas = 'QWERTYUIOPASDFGHJKLÑZXCVBNM'.split('');
    this.teclas_incorrectas = []

    this.score_total += this.score_actual;

    this.intentos = 0;
    this.score_actual = 1000;

    this.imagen_ahorcado = '../../assets/ahorcado/ahorcado-' + this.intentos + '.png'

    this.palabras_terminadas++;

  }
  
  //Recorro los caracteres de la palabra actual. Si hay alguna letra que no este adivinada, la bandera se convierte en false. Si no, queda en true y se retorna este semaforo.
  comprobarSiGano(){
    let bandera_gano = true;
    for(let i = 0; i < this.palabra_actual.length; i++){

      if(this.palabra_actual[i].esta_adivinado == false){
        bandera_gano = false;
      }
  
    }
    return bandera_gano;
  }

}
//IMPLEMENTAR BD
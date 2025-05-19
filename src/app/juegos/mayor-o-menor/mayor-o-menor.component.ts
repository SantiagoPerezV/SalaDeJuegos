import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit, ElementRef, ViewChild, AfterViewInit  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';

import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ResultadosService } from '../../services/resultadosServices/resultados.service';
import { Carta } from '../../lib/interfaces';



@Component({
  selector: 'app-mayor-o-menor',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './mayor-o-menor.component.html',
  styleUrl: './mayor-o-menor.component.css'
})


export class MayorOMenorComponent implements OnInit, AfterViewInit{

  //ARRAYS DE LAS CARTAS SEPARADO POR PALOS
  baraja:{ [key:string]: Carta[] } = {
    'clubs' : [
      { nombre: '2_of_clubs', valor:2, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '3_of_clubs', valor:3, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '4_of_clubs', valor:4, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '5_of_clubs', valor:5, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '6_of_clubs', valor:6, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '7_of_clubs', valor:7, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '8_of_clubs', valor:8, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '9_of_clubs', valor:9, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '10_of_clubs', valor:10, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: 'J_of_clubs', valor:11, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: 'Q_of_clubs', valor:12, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: 'K_of_clubs', valor:13, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: 'A_of_clubs', valor:14, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
    ],
    'diamonds' : [
      { nombre: '2_of_diamonds', valor:2, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '3_of_diamonds', valor:3, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '4_of_diamonds', valor:4, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '5_of_diamonds', valor:5, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '6_of_diamonds', valor:6, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '7_of_diamonds', valor:7, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '8_of_diamonds', valor:8, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '9_of_diamonds', valor:9, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '10_of_diamonds', valor:10, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: 'J_of_diamonds', valor:11, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: 'Q_of_diamonds', valor:12, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: 'K_of_diamonds', valor:13, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: 'A_of_diamonds', valor:14, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
    ],
    'hearts' : [
      { nombre: '2_of_hearts', valor:2, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '3_of_hearts', valor:3, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '4_of_hearts', valor:4, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '5_of_hearts', valor:5, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '6_of_hearts', valor:6, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '7_of_hearts', valor:7, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '8_of_hearts', valor:8, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '9_of_hearts', valor:9, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '10_of_hearts', valor:10, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: 'J_of_hearts', valor:11, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: 'Q_of_hearts', valor:12, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: 'K_of_hearts', valor:13, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: 'A_of_hearts', valor:14, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
    ],
    'spades' : [
      { nombre: '2_of_spades', valor:2, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '3_of_spades', valor:3, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '4_of_spades', valor:4, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '5_of_spades', valor:5, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '6_of_spades', valor:6, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '7_of_spades', valor:7, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '8_of_spades', valor:8, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '9_of_spades', valor:9, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: '10_of_spades', valor:10, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: 'J_of_spades', valor:11, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: 'Q_of_spades', valor:12, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: 'K_of_spades', valor:13, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
      { nombre: 'A_of_spades', valor:14, getImagen(){return '../../assets/Cartas/' + this.nombre + '.png'} },
    ]
  };

  //Variables del juego
  carta_actual!: Carta
  carta_siguiente!: Carta
  score: number = 0;
  juegoTerminado: boolean = false;
  mensajeResultado: string = '';
  baraja_actual = this.baraja;
  palos = Object.keys(this.baraja_actual);
  
  //COMPRUEBO QUE ESTÉ CORRIENDO EN NAVEGADOR
  esta_logueado: boolean = false;
  private isBrowser: boolean = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private resultados: ResultadosService){
    this.isBrowser = isPlatformBrowser(this.platformId);
  };
  
  ngOnInit() {
    if (this.isBrowser) {
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        console.log('Sesión activa', JSON.parse(usuario));
        this.esta_logueado = true;
        this.iniciarJuego();
      }
    }
  };

  //Animacion
  //Obtengo la imagen y el nombre
  @ViewChild('carta') carta!: ElementRef;
  @ViewChild('nombreCarta') nombreCarta!: ElementRef;

  //Evento antes de que salga el elemento en el viewport
  ngAfterViewInit(): void {
    if(this.carta){
      this.animarCarta();
    }
  }

  //Animacion
  animarCarta(): void {
    if (this.carta) {
      gsap.from(this.carta.nativeElement, {
        opacity: 0,
        rotate:360,
        y: -150,
        duration: 1,
        ease: 'power2.out'
      });
    }
    if(this.nombreCarta){
      gsap.from(this.nombreCarta.nativeElement, {
        opacity: 0,
        y: -300,
        duration: 1,
        ease: 'power3.out'
      });
    }
  }

  //Función dde inicio de juego. Variables que son importantes se inicializan
  iniciarJuego(){
    this.carta_actual = this.obtenerCartaAleatoria();
    this.juegoTerminado = false;
    this.mensajeResultado = ''
  }
  
  //Función para obtener una carta aleatoria. Creo una variable tipo Carta que sera el retorno. Obtengo un palo random de la lista de palos actuales. Obtengo las cartas disponibles de ese palo, pregunto si tiene cartas con la funcion, si es así, genero un index entre la cantidad de cartas que haya y guardo la carta; si no, la funcion borra el palo y vuelve a buscar.
  obtenerCartaAleatoria(): Carta{
    let cartaActual!: Carta;

    //Obtengo el palo
    let palo_actual = this.palos[Math.floor(Math.random() * this.palos.length)];

    //Obtengo la carta
    let cartas = this.baraja_actual[palo_actual];
    if(this.validacionBarajaConCartas(palo_actual)){
      let index_carta = Math.floor(Math.random() * cartas.length);
      cartaActual = cartas[index_carta];
    }else{
      this.obtenerCartaAleatoria();
    }

    //Retorno la carta
    return cartaActual;
  }

  //Función para comprobar la cantidad de cartas. Creo la variable bandera que retornare despues. Pregunto si en la lista baraja_actual del palo pasado por parametros tiene 0 cartas; si es asi, la bandera sera falsa, borro el palo de la baraja actual y obtengo la lista de palos actualizada, luego pregunto si no existe ningun palo; si es asi, renuevo la baraja.
  validacionBarajaConCartas(palo:string): boolean{
    let bandera = true;

    if(this.baraja_actual[palo].length === 0){
      bandera = false;
      delete this.baraja_actual[palo];
      this.palos = Object.keys(this.baraja_actual);
      if(!(this.baraja_actual['clubs'] || this.baraja_actual['diamonds'] || this.baraja_actual['hearts'] || this.baraja_actual['spades'])){
        this.baraja_actual = this.baraja;
      }
    }

    return bandera;
  }

  //Función para comprobar la desicion del usuario. Genero la siguiente carta. Obtengo los valores de la carta actual, y la siguiente. Creo variable que devuelve true si la desicion del usuario es correcta, y false si no. Si es correcto, le sumo el puntaje, le envio un mensaje, y pongo la carta actual como la siguiente. Cuando existe la nueva carta, llevo a cabo la animación; y si no es correcto, le digo que perdio y cambio la bandera juegoTerminado, para que sepa que el juego se terminó.
  async elegirCarta(opcion: 'mayor' | 'menor' | 'igual'): Promise<void> {
    if (!this.carta_actual) return;
  
    this.carta_siguiente = this.obtenerCartaAleatoria();
  
    const actual = this.carta_actual.valor;
    const siguiente = this.carta_siguiente.valor;
  
    const esCorrecto =
      (opcion === 'mayor' && siguiente > actual) ||
      (opcion === 'menor' && siguiente < actual) ||
      (opcion === 'igual' && siguiente === actual);
  
    if (esCorrecto) {
      this.score += 100;
      this.mensajeResultado = '¡Correcto!';
      this.carta_actual = this.carta_siguiente;

      if(this.carta){
        this.animarCarta();
      }

    } else {
      this.mensajeResultado = '¡Perdiste!';
      this.resultadoGuardado = false;
      this.juegoTerminado = true;
      await this.guardarResultado();
    }
  }

  private resultadoGuardado: boolean = false;

  async guardarResultado(): Promise<void>{
    if(this.resultadoGuardado) return;

    const usuario = localStorage.getItem('usuario');
    let user: any;
    if (usuario) {
      user = JSON.parse(usuario);
    }

    try{
      if(user){
        await this.resultados.guardarResultados({
          user_id: user.id,
          game_type: 'mayor-o-menor',
          score: this.score,
          details:{
            cartasCorrectas: this.score / 100
          }
        });
      }
      this.resultadoGuardado = true;
      console.log('Datos guardados correctamente');
    } catch(error){
      console.log('Error al guardar los datos: ', error);
    }

  }

}

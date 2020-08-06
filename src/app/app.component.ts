
import { Component, OnInit } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service'
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit {

  public selectedIndex = this.authService.selectedIndex;
  public user = this.authService.actualUser
  public cuentaActual = this.authService.cuentaActual
  cambiarIndex(i) {
    this.authService.selectedIndex = i
    this.authService.menuIndex(i)

  }
  cambiarCuenta(cuenta) {
    this.authService.currentAccount(cuenta.target.value)
    this.authService.menuIndex(0)
    this.cuentaActual = cuenta.target.value
    this.selectedIndex = 0
    if (cuenta.target.value == 'Estudiante') this.paginasMenu = this.paginasEstudiante
    if (cuenta.target.value == 'Desarrollador') this.paginasMenu = this.paginasDesarrollador
    if (cuenta.target.value == 'Interesado') this.paginasMenu = this.paginasInteresado
    if (cuenta.target.value == 'Administrador') this.paginasMenu = this.paginasAdministrador
    this.navCtrl.navigateRoot(this.paginasMenu[0].url);



  }
  cerrarSesion() {
    //console.log("hola")
    //this.user=null
    //this.authService.login(null)
  }

  public paginasMenu = []

  public paginasDesarrollador = [
    {
      title: 'Mis Tareas',
      url: '/calendario-tareas',
      icon: 'calendar'
    },

    {
      title: 'Rendimiento',
      url: '/rendimiento',
      icon: 'cellular'
    },
    {
      title: 'Bitácora',
      url: '/bitacora',
      icon: 'reader'
    },
    {
      title: 'Perfil',
      url: '/perfil',
      icon: 'person'
    },
  ]
  public paginasAdministrador = [
    {
      title: 'Mis Proyectos',
      url: '/calendario-proyecto',
      icon: 'briefcase'
    },
    {
      title: 'Rendimiento',
      url: '/rendimiento',
      icon: 'cellular'
    },
    {
      title: 'Bitácora',
      url: '/bitacora',
      icon: 'reader'
    },
    {
      title: 'Perfil',
      url: '/perfil',
      icon: 'person'
    }
  ]

  public paginasEstudiante = [
    {
      title: 'Mis Tareas',
      url: '/calendario-tareas',
      icon: 'calendar'
    },
    {
      title: 'Rendimiento',
      url: '/rendimiento',
      icon: 'cellular'
    },
    {
      title: 'Bitácora',
      url: '/bitacora',
      icon: 'reader'
    },
    {
      title: 'Perfil',
      url: '/perfil',
      icon: 'person'
    },
  ]

  public paginasInteresado = [

    {
      title: 'Rendimiento',
      url: '/rendimiento',
      icon: 'cellular'
    },
    {
      title: 'Bitácora',
      url: '/bitacora',
      icon: 'reader'
    },
    {
      title: 'Perfil',
      url: '/perfil',
      icon: 'person'
    },

  ];
  public labels = ['Family'];

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authService: AuthService,
    public navCtrl: NavController
  ) {
    this.initializeApp();
    this.selectedIndex = this.authService.selectedIndex;
    this.user = this.authService.actualUser

    this.cuentaActual = this.authService.cuentaActual
    let inicio = ''

    if (this.cuentaActual == 'Estudiante') this.paginasMenu = this.paginasEstudiante
    if (this.cuentaActual == 'Desarrollador') this.paginasMenu = this.paginasDesarrollador
    if (this.cuentaActual == 'Interesado') this.paginasMenu = this.paginasInteresado
    if (this.cuentaActual == 'Administrador') this.paginasMenu = this.paginasAdministrador
    //this.navCtrl.navigateRoot(this.paginasMenu[this.authService.selectedIndex].url);

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    //const path = window.location.pathname.split('folder/')[1];
    //this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());

  }

}
